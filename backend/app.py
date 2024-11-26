from flask import Flask
from flask import request
from openai import OpenAI, AsyncOpenAI
import os
from pydantic import BaseModel
import torch.utils
from transformers import ViTForImageClassification, ViTImageProcessor
from PIL import Image
import io
import requests
import sqlite3
import json
import asyncio
import torch
import sys
yolov5_path = './yolov5'
if yolov5_path not in sys.path:
    sys.path.append(yolov5_path)
from models.common import DetectMultiBackend
from utils.general import non_max_suppression
from utils.torch_utils import select_device
from utils.augmentations import letterbox
import numpy as np
from ultralytics.utils.ops import scale_coords

import pprint

class LoggingMiddleware(object):
    def __init__(self, app):
        self._app = app

    def __call__(self, env, resp):
        errorlog = env['wsgi.errors']
        pprint.pprint(('REQUEST', env), stream=errorlog)

        def log_response(status, headers, *args):
            pprint.pprint(('RESPONSE', status, headers), stream=errorlog)
            return resp(status, headers, *args)

        return self._app(env, log_response)


api_key = os.environ['API_KEY']

app = Flask(__name__)
app.wsgi_app = LoggingMiddleware(app.wsgi_app)
openai = OpenAI(api_key=api_key)

template = '''"Given the following ingredients: %INGREDIENTS%, please provide real, existing recipes that can be made using these ingredients. Make sure the recipes are based on verified sources and not generated or made up. Return the result in JSON format, with the following structure:
[
    {
        'name': 'Recipe Title',
        'ingredients': ['ingredient1', 'ingredient2', '...'],
        'instructions': 'Step-by-step instructions',
        'source': 'Source or link to the verified recipe'
    },
    ...
]
'''

model = ViTForImageClassification.from_pretrained("dima806/fruit_vegetable_image_detection")
preprocessor = ViTImageProcessor.from_pretrained("dima806/fruit_vegetable_image_detection")
yolo = DetectMultiBackend('./yolov5/runs/train/exp/weights/best.pt', device=torch.device('cpu'))
yolo.warmup(imgsz=(1, 3, 640, 640))

conn = sqlite3.connect('recipe.db', check_same_thread=False)

class Recipe(BaseModel):
    name: str
    ingredients: list[str]
    instructions: str
    source: str

class RecipeList(BaseModel):
    recipes: list[Recipe]

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

#@app.route("/llm")
def query_LLM_recipe(ingredients):
    prompt = template.replace('%INGREDIENTS%', str(ingredients))
    temp = openai.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format=RecipeList
    )
    return json.loads(temp.choices[0].message.content)['recipes']

def recognize_image(image):
    outputs = model(**preprocessor(images=image, return_tensors="pt"))
    logits = outputs.logits
    predicted_class_idx = logits.argmax(-1).item()
    labels = model.config.id2label
    print(f"Predicted class: {labels[predicted_class_idx]}")
    return labels[predicted_class_idx]

def recognize_image_yolo(image, img_size=640, conf_threshold=0.3):
    """
    Detect food types in a single image using a YOLOv5 model.

    Args:
        image_path (str): Path to the input image.
        model_path (str): Path to the YOLOv5 trained weights.
        img_size (int): Image size for YOLOv5 inference.
        conf_threshold (float): Confidence threshold for detections.

    Returns:
        List[str]: Detected food types in the image.
    """


    stride, names = yolo.stride, yolo.names
    img0 = image.convert('RGB')
    img = np.array(img0)
    img = letterbox(img, img_size, stride=stride, auto=True)[0]
    img = img.transpose((2, 0, 1))  # HWC -> CHW
    img = np.ascontiguousarray(img)
    img = torch.from_numpy(img).to('cpu').float() / 255.0
    img = img.unsqueeze(0)

    pred = yolo(img)
    pred = non_max_suppression(pred, conf_threshold, 0.45, classes=None, agnostic=False)

    detected_classes = []
    for det in pred:
        if len(det):
            det[:, :4] = scale_coords(img.shape[2:], det[:, :4], np.array(img0).shape[:2]).round()
            for *xyxy, conf, cls in det:
                detected_classes.append(names[int(cls)])

    return list(set(map(lambda c: c.replace('-', ' '), detected_classes)))

def find_recipes_in_db(ingredients_list):
    query = "SELECT * FROM recipes WHERE ingredients MATCH ?"
    ingredients_str = " ".join(ingredients_list).replace('-', ' ')
    cur = conn.cursor()
    cur.execute(query, (ingredients_str,))
    results = cur.fetchmany(10)
    cur.close()

    return list(map(lambda r: {'name': r[0], 'ingredients': r[1], 'instructions': r[2]}, results))

@app.route("/recommend", methods=['POST'])
async def recommend_recipe():
    urls = request.get_json(force=True)['imageUrls']
    preferences: dict = request.get_json(force=True)['preferences']
    print(urls)
    ingredients = set()
    for url in urls:
        ingredients.add(recognize_image_yolo(Image.open(requests.get(url, stream=True).raw)))
        #ingredients.union(recognize_image_yolo(Image.open(requests.get(url, stream=True).raw)))
        print(f'Recognition results: {ingredients}')
    def compare(a):
        a_str = json.dumps(a)
        a_score = 0
        for ingredient in preferences.keys():
            a_score += preferences[ingredient] if a_str.find(ingredient) != -1 else 0
        return a_score
    ingredients = list(ingredients)
    db_recipes = find_recipes_in_db(ingredients)
    llm_recipes = query_LLM_recipe(ingredients)
    llm_recipes.sort(key=compare, reverse=True)
    db_recipes.sort(key=compare, reverse=True)
    return {'llm': llm_recipes, 'db': db_recipes}

@app.route("/recommend_file", methods=['POST'])
def recommend_recipe_file():
    print(request)
    print(request.files.keys())
    print(request.form.keys())
    image = request.form.get('image')
    if (image is None):
        image = request.files.get('image')
    print(image)
    print(type(image))
    ingredients = recognize_image(Image.open(io.BytesIO(image.read())))
    print(ingredients)
    print(type(ingredients))
    return query_LLM_recipe(ingredients)

@app.route("/recommend_firebase", methods=["POST"])
def recommend_recipe_firebase():
    url = request.get_json(force=True)['imageUrl']
    print(url)
    ingredients = recognize_image(Image.open(requests.get(url, stream=True).raw))
    print(ingredients)
    print(type(ingredients))
    return query_LLM_recipe(ingredients)

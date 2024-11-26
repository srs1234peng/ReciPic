curl -L -o ./dataset.zip https://www.kaggle.com/api/v1/datasets/download/paultimothymooney/recipenlg
unzip dataset.zip
python populate_db.py

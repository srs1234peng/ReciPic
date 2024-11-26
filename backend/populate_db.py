import csv
import sqlite3

DATABASE_FILE = "recipe.db"
TABLE_NAME = "recipes"

# Connect to the database
conn = sqlite3.connect(DATABASE_FILE)
cur = conn.cursor()

# Create the table if it doesn't exist (adjust data types as needed)
create_table_query = f"""
CREATE VIRTUAL TABLE recipes USING fts5(
  title,
  ingredients,
  directions,
  NER
);
"""
cur.execute(create_table_query)

# Open the CSV file
with open("RecipeNLG_dataset.csv", "r") as csvfile:
  reader = csv.reader(csvfile)
  next(reader)

  # Insert each row of data into the table
  for row in reader:
    # Convert lists to strings and escape quotes
    #ingredients = convert_list_to_string(row[2]).replace("'", "''")
    #directions = convert_list_to_string(row[3]).replace("'", "''")
    #ner = convert_list_to_string(row[6]).replace("'", "''")
    
    print(row[0])
    insert_query = f"""
    INSERT INTO {TABLE_NAME} (title, ingredients, directions, NER)
    VALUES (?, ?, ?, ?)
    """
    cur.execute(insert_query, (row[1], row[2], row[3], row[-1]))

conn.commit()
conn.close()


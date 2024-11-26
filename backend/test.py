import sqlite3

def find_recipes(ingredients_list, database_file="recipe.db"):
    """
    Finds recipes based on a list of ingredients.

    Args:
        ingredients_list: A list of ingredient strings.
        database_file: The path to the SQLite database file.

    Returns:
        A list of tuples, each containing the recipe ID, title, and ingredients.
    """

    conn = sqlite3.connect(database_file)
    cur = conn.cursor()

    # Construct the FTS5 query
    query = "SELECT * FROM recipes WHERE ingredients MATCH ?"
    ingredients_str = " ".join(ingredients_list)
    
    # Execute the query and fetch 10 results
    cur.execute(query, (ingredients_str,))
    results = cur.fetchmany(10)

    conn.close()
    return results

# Example usage:
ingredients = ["chicken", "curry"]
recipes = find_recipes(ingredients)
for recipe in recipes:
    print(f"Recipe ID: {recipe[0]}, Title: {recipe[1]}, Ingredients: {recipe[2]}")
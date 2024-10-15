import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const RecipeRecommendation = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <View style={styles.recipeContainer}>
      <Text style={styles.recipeName}>{recipe.name}</Text>

      <Text style={styles.sectionHeader}>Ingredients:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredient}>
          - {ingredient}
        </Text>
      ))}

      <Text style={styles.sectionHeader}>Instructions:</Text>
      <Text style={styles.instructions}>
        {recipe.instructions}
      </Text>

      {recipe.source && (
        <Text style={styles.source}>
          Source: <Text style={styles.sourceLink}>{recipe.source}</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  recipeContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    lineHeight: 22,
  },
  source: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },
  sourceLink: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});

export default RecipeRecommendation;

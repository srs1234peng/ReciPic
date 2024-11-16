import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const RecipeDetailScreen = ({ route }) => {
  const { recipe } = route.params; // Retrieve the selected recipe from navigation params

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.sectionHeader}>Ingredients:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.text}>
          - {ingredient}
        </Text>
      ))}
      <Text style={styles.sectionHeader}>Instructions:</Text>
      <Text style={styles.text}>{recipe.instructions}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF6F61',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
});

export default RecipeDetailScreen;

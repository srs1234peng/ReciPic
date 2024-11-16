import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { saveKeywordsToHistory } from '../Components/PreferenceManager'; // Import preference manager

const RecipeDetailScreen = ({ route }) => {
  const { recipe } = route.params; // Retrieve the selected recipe from navigation params

  // Function to handle "Select" action
  const handleSelectRecipe = async () => {
    // Confirm selection
    Alert.alert(
      'Confirm Selection',
      `Are you sure you want to select "${recipe.name}" as your preferred recipe?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Save keywords to local preferences
              if (recipe.keywords && Array.isArray(recipe.keywords)) {
                await saveKeywordsToHistory(recipe.keywords);
                Alert.alert('Success', 'Your preference has been saved!');
              } else {
                Alert.alert('Error', 'This recipe does not have valid keywords.');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to save your preference.');
              console.error('Error saving preferences:', error);
            }
          },
        },
      ]
    );
  };

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

      {/* Select Button */}
      <TouchableOpacity style={styles.selectButton} onPress={handleSelectRecipe}>
        <Text style={styles.buttonText}>Select</Text>
      </TouchableOpacity>
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
  selectButton: {
    backgroundColor: '#FF6F61',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeDetailScreen;

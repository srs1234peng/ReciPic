import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const RecipeModal = ({ visible, recipe, onClose }) => {
  console.log('Displaying recipe in modal:', recipe.name);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.recipeTitle}>{recipe.name}</Text>

            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>
                - {ingredient}
              </Text>
            ))}

            <Text style={styles.sectionTitle}>Instructions:</Text>
            <Text style={styles.instructionsText}>{recipe.instructions}</Text>

            <Text style={styles.sectionTitle}>Source:</Text>
            <Text style={styles.sourceText}>{recipe.source}</Text>

            <Button title="Close" onPress={onClose} color="#DB4D6D" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  ingredientText: {
    fontSize: 16,
    marginVertical: 2,
  },
  instructionsText: {
    fontSize: 16,
    marginVertical: 10,
  },
  sourceText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default RecipeModal;

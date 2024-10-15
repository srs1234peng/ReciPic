import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Button, FlatList } from 'react-native';

const RecipeModal = ({ visible, recipes, selectedRecipeIndex, onClose }) => {
  const renderRecipe = ({ item }) => (
    <View style={styles.modalContent}>
      <ScrollView>
        <Text style={styles.recipeTitle}>{item.name}</Text>

        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {item.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientText}>
            - {ingredient}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Instructions:</Text>
        {item.instructions.split('\n').map((instruction, index) => (
          <Text key={index} style={styles.instructionsText}>
            {instruction}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Source:</Text>
        <Text style={styles.sourceText}>{item.source}</Text>

        <Button title="Close" onPress={onClose} color="#DB4D6D" />
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <FlatList
          data={recipes}
          horizontal
          pagingEnabled
          initialScrollIndex={selectedRecipeIndex}
          renderItem={renderRecipe}
          keyExtractor={(item, index) => index.toString()}
        />
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
    width: 300,
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

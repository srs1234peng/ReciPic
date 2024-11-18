import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const RecipeListScreen = ({ navigation, route }) => {
  const { recipes } = route.params;

  const renderRecipeItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      <Text style={styles.recipeTitle}>{index + 1}. {item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipe List</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContainer}
      />
      <Text style={styles.infoText}>Recipes are recommended based on your preferences.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  recipeItem: {
    backgroundColor: '#FF6F61',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeListScreen;

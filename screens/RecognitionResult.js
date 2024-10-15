import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecognitionResult = ({ result }) => {
  if (!result) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recognition Result</Text>
      <Text style={styles.text}>Recipes found: {result.recipes.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default RecognitionResult;

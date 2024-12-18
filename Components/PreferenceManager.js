import AsyncStorage from '@react-native-async-storage/async-storage';

// Save keywords to the user's preference history
export const saveKeywordsToHistory = async (keywords) => {
  try {
    // Fetch existing history from AsyncStorage
    const storedHistory = await AsyncStorage.getItem('userPreferences');
    const history = storedHistory ? JSON.parse(storedHistory) : {};

    // Update keyword frequency
    keywords.forEach((keyword) => {
      history[keyword] = (history[keyword] || 0) + 1; // Increment frequency
    });

    // Save updated history back to AsyncStorage
    await AsyncStorage.setItem('userPreferences', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving keywords to history:', error);
  }
};

// Fetch user preference history
export const getHistoryKeywords = async () => {
  try {
    const storedHistory = await AsyncStorage.getItem('userPreferences');
    return storedHistory ? JSON.parse(storedHistory) : {};
  } catch (error) {
    console.error('Error fetching history keywords:', error);
    return {};
  }
};

// Clear user preferences (e.g., reset preferences)
export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem('userPreferences');
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};

// Generate keywords from a recipe
export const generateKeywords = (recipe) => {
  const keywords = new Set();

  // Extract keywords from the recipe name
  if (recipe.name) {
    recipe.name.split(/\s+/).forEach((word) => keywords.add(word.toLowerCase()));
  }

  // Extract keywords from the ingredients
  if (Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach((ingredient) => {
      ingredient.split(/\s+/).forEach((word) => keywords.add(word.toLowerCase()));
    });
  }

  // Extract keywords from the instructions (array of strings)
  if (Array.isArray(recipe.instructions)) {
    recipe.instructions.forEach((instruction) => {
      instruction.split(/\s+/).forEach((word) => keywords.add(word.toLowerCase()));
    });
  }

  // Convert the Set to an array and remove common stopwords
  const stopwords = ['and', 'or', 'with', 'of', 'the', 'a', 'an', 'to', 'in', 'for', 'on', 'at', 'by', 'from', 'as', 'but', 'is', 'are', 'was', 'were'];
  return Array.from(keywords).filter((word) => !stopwords.includes(word));
};

// Generate keywords for multiple recipes
export const generateKeywordsFromRecipes = (recipes) => {
  const allKeywords = recipes.flatMap((recipe) => generateKeywords(recipe));
  return [...new Set(allKeywords)]; // Remove duplicates
};

export default {
  saveKeywordsToHistory,
  getHistoryKeywords,
  clearHistory,
  generateKeywords,
  generateKeywordsFromRecipes,
};

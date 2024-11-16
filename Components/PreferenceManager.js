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

export default {
  saveKeywordsToHistory,
  getHistoryKeywords,
  clearHistory,
};

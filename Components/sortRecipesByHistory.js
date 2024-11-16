import { getHistoryKeywords } from './PreferenceManager';

const sortRecipesByHistory = async (recipes) => {
  try {
    // Fetch user preference history
    const history = await getHistoryKeywords();

    // Add weights to recipes based on keyword frequency in history
    const weightedRecipes = recipes.map((recipe) => {
      let weight = 0;

      // Check if recipe.keywords is an array
      if (Array.isArray(recipe.keywords)) {
        recipe.keywords.forEach((keyword) => {
          weight += history[keyword] || 0; // Increment weight based on keyword frequency
        });
      }

      return { ...recipe, weight };
    });

    // Sort recipes by weight in descending order
    return weightedRecipes.sort((a, b) => b.weight - a.weight);
  } catch (error) {
    console.error('Error sorting recipes by history:', error);
    return recipes; // Return original recipes if sorting fails
  }
};

export default sortRecipesByHistory;

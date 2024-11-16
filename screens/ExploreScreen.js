import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, TouchableOpacity, Text} from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/FirebaseSetup';
import RecipeModal from './RecipeModal'; // Modal component to show recipe details
import { saveKeywordsToHistory, getHistoryKeywords, clearHistory } from '../Components/PreferenceManager';
import sortRecipesByHistory from '../Components/SortRecipesByHistory'; // Sorting helper function

const ExploreScreen = () => {
  const [images, setImages] = useState([]);
  const [recognitionResult, setRecognitionResult] = useState([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0); // Index of the selected recipe
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const compressImage = async (uri) => {
    try {
      console.log('Compressing image...');
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error('Error during image compression:', error);
      Alert.alert('Error', 'Failed to compress the image.');
      return null;
    }
  };

  const uploadImageToFirebase = async (compressedUri) => {
    try {
      const response = await fetch(compressedUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `images/${Date.now()}.jpeg`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
      Alert.alert('Upload Error', 'Failed to upload image.');
      return null;
    }
  };

  const sendImageForRecognition = async (uri) => {
    const compressedUri = await compressImage(uri);
    if (!compressedUri) return;

    const uploadedUrl = await uploadImageToFirebase(compressedUri);
    if (!uploadedUrl) return;

    try {
      const response = await fetch('http://45.32.89.216:5000/recommend_firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: uploadedUrl }),
      });

      if (response.ok) {
        const result = await response.json();
        const contentString = result.choices[0].message.content;
        const parsedContent = JSON.parse(contentString);

        if (parsedContent && Array.isArray(parsedContent.recipes)) {
          const recipes = parsedContent.recipes;

          // Save keywords to local preferences
          const keywords = recipes.flatMap((recipe) => recipe.keywords);
          await saveKeywordsToHistory(keywords);

          // Sort recipes by user preferences
          const sortedRecipes = await sortRecipesByHistory(recipes);
          setRecognitionResult(sortedRecipes);
        } else {
          Alert.alert('Error', 'Unexpected response format.');
        }
      } else {
        Alert.alert('Error', `Recognition failed. Status code: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  const onSelectImage = async () => {
    const selectedImages = await handleSelectImage();
    if (selectedImages && selectedImages.length > 0) {
      setImages(selectedImages);
      sendImageForRecognition(selectedImages[0]);
    }
  };

  const onTakePhoto = async () => {
    const takenPhoto = await handleTakePhoto();
    if (takenPhoto) {
      setImages([takenPhoto]);
      sendImageForRecognition(takenPhoto);
    }
  };

  const showRecipeDetails = (index) => {
    setSelectedRecipeIndex(index);
    setModalVisible(true);
  };

  const handleClearPreferences = async () => {
    await clearHistory();
    Alert.alert('Preferences Cleared', 'Your preferences have been cleared.');
  };

  return (
    <View style={styles.container}>
      <IconButton icon="camera" size={50} onPress={onTakePhoto} style={styles.icon} />
      <Button mode="contained" onPress={onSelectImage} buttonColor="#DB4D6D">
        Upload from Library
      </Button>
      <Button mode="outlined" onPress={handleClearPreferences} style={styles.clearButton}>
        Clear Preferences
      </Button>

      <ScrollView contentContainerStyle={styles.imageContainer}>
        {images.length > 0 ? (
          images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              {recognitionResult.length > 0 && (
                <TouchableOpacity
                  style={styles.recipeButton}
                  onPress={() => showRecipeDetails(index)}
                >
                  <Text style={styles.buttonText}>Show Recipe Details</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text>No images selected or taken yet.</Text>
        )}
      </ScrollView>

      <RecipeModal
        visible={modalVisible}
        recipes={recognitionResult}
        selectedRecipeIndex={selectedRecipeIndex}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  clearButton: {
    marginTop: 10,
    borderColor: '#FF6F61',
    borderWidth: 1,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
  recipeButton: {
    backgroundColor: '#FF6F61',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ExploreScreen;

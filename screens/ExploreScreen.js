import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/FirebaseSetup';
import { saveKeywordsToHistory, clearHistory } from '../Components/PreferenceManager';
import sortRecipesByHistory from '../Components/sortRecipesByHistory';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../Components/GradientBackground';

const ExploreScreen = () => {
  const [images, setImages] = useState([]);
  const [recognitionResult, setRecognitionResult] = useState([]);
  const navigation = useNavigation();

  const compressImage = async (uri) => {
    try {
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

  const handleUploadAllImages = async () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please upload some images before submitting.');
      return;
    }

    // Confirmation prompt
    Alert.alert(
      'Confirm Submission',
      'Are you sure you want to submit all the selected images?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            const urls = [];
            for (const uri of images) {
              const compressedUri = await compressImage(uri);
              if (compressedUri) {
                const uploadedUrl = await uploadImageToFirebase(compressedUri);
                if (uploadedUrl) {
                  urls.push(uploadedUrl);
                }
              }
            }

            console.log('All uploaded image URLs:', urls);
            sendImagesForRecognition(urls);
          },
        },
      ]
    );
  };

  const sendImagesForRecognition = async (urls) => {
    try {
      console.log('Sending image URLs to backend:', urls);
      const response = await fetch('http://45.32.89.216:5000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrls: urls }),
      });

      if (response.ok) {
        console.log('Backend response received.');
        const result = await response.json();
        const contentString = result.choices[0].message.content;
        const parsedContent = JSON.parse(contentString);

        if (parsedContent && Array.isArray(parsedContent.recipes)) {
          const recipes = parsedContent.recipes;

          const keywords = recipes.flatMap((recipe) => recipe.keywords || []);
          await saveKeywordsToHistory(keywords);

          const sortedRecipes = await sortRecipesByHistory(recipes);
          setRecognitionResult(sortedRecipes);

          Alert.alert('Success', 'Recipes have been fetched successfully.');
          navigation.navigate('RecipeList', { recipes: sortedRecipes });
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
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const onTakePhoto = async () => {
    const takenPhoto = await handleTakePhoto();
    if (takenPhoto) {
      setImages((prevImages) => [...prevImages, takenPhoto]);
    }
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleClearPreferences = async () => {
    await clearHistory();
    Alert.alert('Preferences Cleared', 'Your preferences have been cleared.');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <IconButton icon="camera" size={50} onPress={onTakePhoto} style={styles.icon} />
        <Button mode="contained" onPress={onSelectImage} buttonColor="#DB4D6D">
          Upload from Library
        </Button>
        <Button mode="outlined" onPress={handleClearPreferences} style={styles.clearButton}>
          Clear Preferences
        </Button>
        <Button mode="contained" onPress={handleUploadAllImages} style={styles.uploadButton}>
          Finish & Submit
        </Button>

        <ScrollView contentContainerStyle={styles.imageContainer}>
          {images.length > 0 ? (
            images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteImage(index)}
                >
                  <Text style={styles.deleteButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>No images selected or taken yet.</Text>
          )}
        </ScrollView>
      </View>
    </GradientBackground>
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
  uploadButton: {
    marginTop: 10,
    backgroundColor: '#FF6F61',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExploreScreen;

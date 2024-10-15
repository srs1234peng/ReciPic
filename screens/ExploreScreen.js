import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/FirebaseSetup';
import RecipeModal from './RecipeModal'; // Modal component to show recipe details

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
      console.log('Compressed image URI:', manipulatedImage.uri);
      return manipulatedImage.uri;
    } catch (error) {
      console.error('Error during image compression:', error);
      Alert.alert('Error', 'Failed to compress the image.');
      return null;
    }
  };

  const uploadImageToFirebase = async (compressedUri) => {
    try {
      console.log('Uploading image to Firebase...');
      const response = await fetch(compressedUri);
      const blob = await response.blob();
      console.log(`Compressed Blob size: ${blob.size} Blob type: ${blob.type}`);

      const storageRef = ref(storage, `images/${Date.now()}.jpeg`);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('Image uploaded successfully:', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
      Alert.alert('Upload Error', 'Failed to upload image.');
      return null;
    }
  };

  const sendImageForRecognition = async (uri) => {
    console.log('Preparing to send image for recognition...');
  
    // Compress the image before sending
    const compressedUri = await compressImage(uri);
    if (!compressedUri) return; // If compression fails, return early
  
    // Upload compressed image to Firebase
    const uploadedUrl = await uploadImageToFirebase(compressedUri);
    if (!uploadedUrl) return; // If upload fails, return early
  
    // Send the Firebase Storage URL to the API for recognition
    console.log('Sending image URL to API for recognition:', uploadedUrl);
    try {
      const response = await fetch('http://45.32.89.216:5000/recommend_firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: uploadedUrl }),
      });
  
      console.log(`Response status: ${response.status}`);
      const responseText = await response.text();
      console.log(`Response body: ${responseText}`);
  
      if (response.ok) {
        const result = JSON.parse(responseText);
  
        // Parse the `content` field from `choices[0].message.content`
        const contentString = result.choices[0].message.content;
        const parsedContent = JSON.parse(contentString); // Parse the string into a JSON object
  
        console.log('Parsed Content:', parsedContent);
  
        // Now we can safely access `recipes` from the parsed content
        if (parsedContent && Array.isArray(parsedContent.recipes)) {
          setRecognitionResult(parsedContent.recipes); // Update the state with the parsed recipes
          console.log('Recognition Success: Recipes are available.');
        } else {
          console.log('Unexpected response structure:', result);
          Alert.alert('Error', 'Unexpected response format.');
        }
      } else {
        console.log('Recognition failed with status:', response.status, 'Response:', responseText);
        Alert.alert('Error', `Failed to get a recognition result. Status code: ${response.status}. Response: ${responseText}`);
      }
    } catch (error) {
      console.error('Error occurred while sending the image URL:', error);
      Alert.alert('Error', `An error occurred while sending the image: ${error.message}`);
    }
  };

  const onSelectImage = async () => {
    console.log('Image selection started...');
    const selectedImages = await handleSelectImage();
    if (selectedImages && selectedImages.length > 0) {
      console.log('Images selected:', selectedImages);
      setImages(selectedImages);
      sendImageForRecognition(selectedImages[0]);
    } else {
      console.log('Image selection was cancelled or failed.');
    }
  };

  const onTakePhoto = async () => {
    console.log('Photo capture started...');
    const takenPhoto = await handleTakePhoto();
    if (takenPhoto) {
      console.log('Photo captured:', takenPhoto);
      setImages([takenPhoto]);
      sendImageForRecognition(takenPhoto);
    } else {
      console.log('Photo capture was cancelled or failed.');
    }
  };

  const showRecipeDetails = (index) => {
    console.log('Showing recipe details for index:', index);
    setSelectedRecipeIndex(index);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <IconButton icon="camera" size={50} onPress={onTakePhoto} style={styles.icon} />
      <Button mode="contained" onPress={onSelectImage} buttonColor="#DB4D6D">
        Upload from Library
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

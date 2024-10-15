import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { IconButton, Button, Text } from 'react-native-paper';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/FirebaseSetup';

const ExploreScreen = () => {
  const [images, setImages] = useState([]);
  const [recognitionResult, setRecognitionResult] = useState(null); // For storing recognition result

  const compressImage = async (uri) => {
    try {
      console.log('Compressing image...');
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize to 800px width
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress to 70% quality
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
      const response = await fetch(compressedUri);
      const blob = await response.blob();
      console.log(`Compressed Blob size: ${blob.size} Blob type: ${blob.type}`);
      
      const storageRef = ref(storage, `images/${Date.now()}.jpeg`); // Unique filename
      console.log('Uploading image to Firebase Storage...');
      
      await uploadBytes(storageRef, blob); // Uploading to Firebase
      const downloadUrl = await getDownloadURL(storageRef); // Get the URL after upload
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
        console.log('Recognition result received:', result);
        setRecognitionResult(result); // Update the state with the recognition result
        Alert.alert('Recognition Success', `Recognition Result: ${JSON.stringify(result)}`);
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
    if (selectedImages) {
      console.log('Images selected:', selectedImages);
      setImages(selectedImages);
      // Automatically send the first selected image for recognition
      if (selectedImages.length > 0) {
        console.log('Sending the first selected image for recognition...');
        sendImageForRecognition(selectedImages[0]);
      } else {
        console.log('No images selected');
      }
    } else {
      console.log('Image selection was cancelled or failed.');
    }
  };

  const onTakePhoto = async () => {
    console.log('Photo capture started...');
    const takenPhoto = await handleTakePhoto();
    if (takenPhoto) {
      console.log('Photo captured:', takenPhoto);
      setImages([...images, takenPhoto]);
      // Automatically send the taken photo for recognition
      console.log('Sending the captured photo for recognition...');
      sendImageForRecognition(takenPhoto);
    } else {
      console.log('Photo capture was cancelled or failed.');
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="camera"
        size={50}
        onPress={onTakePhoto}
        style={styles.icon}
      />
      <Button mode="contained" onPress={onSelectImage} buttonColor="#DB4D6D">
        Upload from Library
      </Button>

      <ScrollView contentContainerStyle={styles.imageContainer}>
        {images.length > 0 ? (
          images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))
        ) : (
          <Text>No images selected or taken yet.</Text>
        )}
      </ScrollView>

      {recognitionResult && (
        <View style={styles.recognitionResult}>
          <Text>Recognition Result: {JSON.stringify(recognitionResult)}</Text>
        </View>
      )}
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
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
  recognitionResult: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
});

export default ExploreScreen;

import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { IconButton, Button, Text } from 'react-native-paper';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';

const ExploreScreen = () => {
  const [images, setImages] = useState([]);
  const [recognitionResult, setRecognitionResult] = useState(null); // For storing recognition result

  const sendImageForRecognition = async (uri) => {
    console.log('Preparing to send image for recognition...');
    
    // Convert the image URI to a Blob
    const blob = await fetch(uri).then((res) => res.blob());
    console.log(`Blob size: ${blob.size} Blob type: ${blob.type}`);

    // Create a FormData object
    const formData = new FormData();
    console.log('Appending blob to FormData...');

    // Append the Blob to FormData with the correct key 'image' and a file name
    formData.append('image', blob, 'image.jpeg');  // Ensure proper file name with extension

    // Manually log the appended content (you can't directly inspect FormData in React Native)
    const formDataLog = {};
    formDataLog['image'] = { blobSize: blob.size, blobType: blob.type, fileName: 'image.jpeg' };
    console.log('FormData Log:', formDataLog);

    try {
      console.log('Sending image to API:', uri);
      const response = await fetch('http://45.32.89.216:5000/recommend_file', {
        method: 'POST',
        body: formData,
      });
    
      // Log status and response for debugging
      console.log(`Response status: ${response.status}`);
      
      const responseText = await response.text();  // Use .text() for more visibility of response body
      console.log(`Response body: ${responseText}`);
    
      if (response.ok) {
        const result = await response.json();
        console.log('Recognition result received:', result);
        setRecognitionResult(result);  // Update the state with the recognition result
        Alert.alert('Recognition Success', `Recognition Result: ${JSON.stringify(result)}`);
      } else {
        console.log('Recognition failed with status:', response.status, 'Response:', responseText);
        Alert.alert('Error', `Failed to get a recognition result. Status code: ${response.status}. Response: ${responseText}`);
      }
    } catch (error) {
      console.error('Error occurred while sending the image:', error);
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
          <Text>No images selected or taken yet.</Text> // Wrapped in <Text> properly
        )}
      </ScrollView>

      {recognitionResult && (
        <View style={styles.recognitionResult}>
          <Text>Recognition Result: {JSON.stringify(recognitionResult)}</Text>  {/* Ensure it is wrapped in Text */}
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

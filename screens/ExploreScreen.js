import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { IconButton, Button, Text } from 'react-native-paper';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';

const ExploreScreen = () => {
    const [images, setImages] = useState([]);
    const [recognitionResult, setRecognitionResult] = useState(null); // For storing recognition result

    const sendImageForRecognition = async (imageUri) => {

    };

    const onSelectImage = async () => {
      const selectedImages = await handleSelectImage();
      if (selectedImages) {
        setImages(selectedImages);
        if (selectedImages.length > 0) {
          sendImageForRecognition(selectedImages[0]);
        }
      }
    };
  
    const onTakePhoto = async () => {
      const takenPhoto = await handleTakePhoto();
      if (takenPhoto) {
        setImages([...images, takenPhoto]);
        // Automatically send the taken photo for recognition
        sendImageForRecognition(takenPhoto);
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
}

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
  });

export default ExploreScreen;

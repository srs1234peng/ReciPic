import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { IconButton, Button, Text } from 'react-native-paper';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';

const ExploreScreen = () => {
    const [images, setImages] = useState([]);

    const onSelectImage = async () => {
      const selectedImages = await handleSelectImage();
      if (selectedImages) {
        setImages(selectedImages);
      }
    };
  
    const onTakePhoto = async () => {
      const takenPhoto = await handleTakePhoto();
      if (takenPhoto) {
        setImages([...images, takenPhoto]);
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

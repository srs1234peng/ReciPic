// import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Camera access is required to take a photo.');
    return false;
  }
  return true;
};

const requestLibraryPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Media library access is required to select a photo.');
    return false;
  }
  return true;
};

export const handleSelectImage = async () => {
  const hasPermission = await requestLibraryPermission();
  if (!hasPermission) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true, 
    selectionLimit: 10,
    quality: 1,
  });

  if (!result.canceled) {
    const uriList = result.assets.map((asset) => asset.uri);
    return uriList;
  }
};

export const handleTakePhoto = async () => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) return;

  const result = await ImagePicker.launchCameraAsync({
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

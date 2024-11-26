import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase/FirebaseSetup';
import { handleSelectImage, handleTakePhoto } from '../ImageManager';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import Context from '../Context/context';
import { IconButton, Avatar, ActivityIndicator } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImageManipulator from 'expo-image-manipulator';

const UserScreen = () => {
  const { user, setUser } = useContext(Context);
  const navigation = useNavigation();
  const [avatarUri, setAvatarUri] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      fetchUserData(user.uid);
    } else {
      console.log('No user in context');
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username || '');
        setAvatarUri(userData.avatarUrl || null);
      } else {
        Alert.alert("User not found", "No user document exists for this account.");
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert("Error", "Failed to fetch user data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImageAsync = async (uri, path) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, path);

      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Error in uploadImageAsync:', error);
      Alert.alert('Upload Error', error.message);
      return null;
    }
  };

  const handleAvatarPress = () => {
    Alert.alert(
      'Select an option',
      '',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const uri = await handleTakePhoto();
            if (uri) await processImage(uri);
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const uriList = await handleSelectImage();
            if (uriList && uriList.length > 0) await processImage(uriList[0]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const processImage = async (uri) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const uploadedUrl = await uploadImageAsync(manipulatedImage.uri, `avatars/${user.uid}`);
      if (uploadedUrl) {
        setAvatarUri(uploadedUrl);

        try {
          if (user?.uid) {
            await updateDoc(doc(db, 'users', user.uid), { avatarUrl: uploadedUrl });
            Alert.alert('Success', 'Avatar updated successfully!');
          } else {
            Alert.alert('Error', 'User ID is missing.');
          }
        } catch (error) {
          console.error('Error updating avatar:', error);
          Alert.alert('Error', 'Failed to update avatar.');
        }
      } else {
        Alert.alert('Error', 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error in processImage:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      Alert.alert('Success', 'User logged out successfully');
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Login' }],
      // });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#1C5D3A"/>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#E1A679', '#B5FFFC']} // Add your preferred gradient colors here
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {user ? (
          <>
            <View style={styles.avatarContainer}>
              <TouchableOpacity style={styles.avatarTouchable} onPress={handleAvatarPress}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <Avatar.Text size={150} label={username ? username.charAt(0) : "?"} style={styles.avatarIcon} />
                )}
                <View style={styles.cameraIconContainer}>
                  <IconButton icon="camera" size={24} style={styles.cameraIcon} />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{username}</Text>
            <Text style={styles.userEmail}>{email}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              {isLoading ? <ActivityIndicator color='#1C5D3A' /> : <Text style={styles.buttonText}>Log Out</Text>}
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  avatarIcon: {
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  cameraIcon: {
    backgroundColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#7A7A7A',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#E57373',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#1C5D3A',
    fontSize: 18,
  },
});

export default UserScreen;

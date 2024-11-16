import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Easing, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/FirebaseSetup';
import styles from '../styles/LogInOutStyle';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const fadeTitleAnim = useRef(new Animated.Value(0)).current;
  const fadeGroupAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    Animated.sequence([
      Animated.timing(fadeTitleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeGroupAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Additional login success logic if needed
      })
      .catch((error) => {
        Alert.alert('Failed to log in', error.message);
      });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={['#E1A679', '#B5FFFC']} // Add your preferred gradient colors here
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            {!keyboardVisible && (
              <Animated.View style={{ opacity: fadeTitleAnim }}>
                <Text style={styles.bigtitle}>
                  What Can I Cook Today?
                </Text>
                
                <Text style={styles.description}>
                  Log in or sign up to discover your exclusive recipes.
                </Text>
              </Animated.View>
            )}
            
            <Animated.View style={{ opacity: fadeGroupAnim }}>
              <Text style={styles.title}>Login</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label} onPress={() => emailInputRef.current.focus()}>Email Address</Text>
                <TextInput
                  ref={emailInputRef}
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label} onPress={() => passwordInputRef.current.focus()}>Password</Text>
                <TextInput
                  ref={passwordInputRef}
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.link}>New User? Create an account</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.link}>Forgot Password?</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

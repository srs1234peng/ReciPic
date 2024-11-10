import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/FirebaseSetup';
import styles from '../styles/LogInOutStyle';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const fadeTitleAnim = useRef(new Animated.Value(0)).current;
  const fadeGroupAnim = useRef(new Animated.Value(0)).current; // Single animation for Login, Inputs, and Button

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // adjust if necessary
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
          {!keyboardVisible && (
            <>
              <Animated.Text style={[styles.bigtitle, { opacity: fadeTitleAnim }]}>
                Welcome to Walking Master
              </Animated.Text>
              
              <Animated.Text style={[styles.description, { opacity: fadeTitleAnim }]}>
                Log in or sign up to record your adventure.
              </Animated.Text>
            </>
          )}
          
          <Animated.View style={{ opacity: fadeGroupAnim }}>
            <Text style={styles.title}>Login</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label} onPress={() => this.emailInput.focus()}>Email Address</Text>
              <TextInput
                ref={(input) => { this.emailInput = input }}
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label} onPress={() => this.passwordInput.focus()}>Password</Text>
              <TextInput
                ref={(input) => { this.passwordInput = input }}
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => {
              if (!email || !password) {
                alert('Please fill all fields');
                return;
              }
              signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                  const user = userCredential.user;
                  // Add any additional logic here
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  alert('Failed to log in');
                });
            }}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('Signup')}>
              <Text style={styles.link}>New User? Create an account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('ForgotPassword')}>
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

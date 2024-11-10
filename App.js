import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/FirebaseSetup';
import { ContextProvider } from './Context/context';
import AuthStateListener from './Context/AuthStateListener';

// Importing screens and navigators
import LoginScreen from './screens/LogInScreen';
import SignupScreen from './screens/SignUpScreen';
import ExploreScreen from './screens/ExploreScreen';
import BottomNavigator from './navigation/BottomNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserAuthenticated(!!user); // Set to true if a user is authenticated
    });

    return unsubscribe; // Cleanup the listener on unmount
  }, []);

  return (
    <ContextProvider>
      <AuthStateListener>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {isUserAuthenticated ? (
                <>
                  <Stack.Screen
                    name="bottom"
                    component={BottomNavigator}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="Explore" component={ExploreScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Signup" component={SignupScreen} />
                  {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </AuthStateListener>
    </ContextProvider>
  );
}

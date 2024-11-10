import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import BottomNavigator from './navigation/BottomNavigator'; 
import AuthStateListener from './Context/AuthStateListener';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserAuthenticated(true);
      } else {
        setIsUserAuthenticated(false);
      }
    });

    return unsubscribe; // Cleanup the listener on unmount
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isUserAuthenticated ? <>
            <Stack.Screen name="GameBoard" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="LocationSelect" component={LocationSearchScreen} />
            <Stack.Screen name="InteractiveMap" component={InteractiveMap} />
          </> : <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

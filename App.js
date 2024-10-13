import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import BottomNavigator from './navigation/BottomNavigator'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={BottomNavigator}
            options={{ headerShown: false }}  // Hides the header for the tab navigation
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

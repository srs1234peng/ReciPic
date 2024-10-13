import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import ExploreScreen from './screens/ExploreScreen';
import UserScreen from './screens/UserScreen';
import { IconButton } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Explore"
          screenOptions={({ navigation }) => ({
            headerRight: () => (
              <IconButton
                icon="account"
                size={25}
                onPress={() => navigation.navigate('User')}
              />
            ),
            headerStyle: { backgroundColor: '#6200ee' },
            headerTintColor: '#fff',
          })}
        >
          <Stack.Screen 
            name="Explore" 
            component={ExploreScreen} 
            options={{ title: 'Explore' }} 
          />
          <Stack.Screen 
            name="User" 
            component={UserScreen} 
            options={{ title: 'User Profile' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

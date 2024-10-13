import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExploreScreen from '../screens/ExploreScreen';  
import ProfileScreen from '../screens/ProfileScreen'; 

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Explore') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'User') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1C5D3A',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: [
        {
          display: 'flex',
        },
        null,
      ],
    })}
  >
    <Tab.Screen name="Explore" component={ExploreScreen} />  
    <Tab.Screen name="User" component={ProfileScreen} />   
  </Tab.Navigator>
);

export default BottomTabNavigator;

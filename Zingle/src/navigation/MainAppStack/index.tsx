import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainAppStackParamList } from '@types';
import { BottomTabNavigator } from '../BottomTabNavigator';

const Stack = createNativeStackNavigator<MainAppStackParamList>();

// Placeholder screens
const ProfileDetailScreen = () => null;
const ChatScreen = () => null;
const MatchedProfilesScreen = () => null;

export const MainAppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MainBottomTab"
        component={BottomTabNavigator}
      />
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
        }}
      >
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="MatchedProfiles" component={MatchedProfilesScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

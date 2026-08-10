import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LikesStackParamList } from '@types';
import { LikesScreen } from '@screens/Likes';
import { LikeProfileScreen } from '@screens/Likes/LikeProfileScreen';

const Stack = createNativeStackNavigator<LikesStackParamList>();

export const LikesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LikesList" component={LikesScreen} />
    <Stack.Screen
      name="LikeProfile"
      component={LikeProfileScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </Stack.Navigator>
);

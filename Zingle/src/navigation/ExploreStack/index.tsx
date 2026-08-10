import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ExploreStackParamList } from '@types';
import { ExploreScreen } from '@screens/Explore';
import { ExploreCategoryScreen } from '@screens/Explore/ExploreCategoryScreen';
import { ExploreProfileScreen } from '@screens/Explore/ExploreProfileScreen';

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export const ExploreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ExploreList" component={ExploreScreen} />
    <Stack.Screen
      name="ExploreCategory"
      component={ExploreCategoryScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <Stack.Screen
      name="ExploreProfile"
      component={ExploreProfileScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </Stack.Navigator>
);

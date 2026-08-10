import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ChatStackParamList } from '@types';
import { ChatListScreen } from '@screens/Chat/ListScreen';
import { ChatThreadScreen } from '@screens/Chat/ChatThreadScreen';

const Stack = createNativeStackNavigator<ChatStackParamList>();

export const ChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChatList" component={ChatListScreen} />
    <Stack.Screen
      name="ChatThread"
      component={ChatThreadScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </Stack.Navigator>
);

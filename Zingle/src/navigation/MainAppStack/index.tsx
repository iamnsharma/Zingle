import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainAppStackParamList } from '@types';
import { useOnboardingStore } from '@stores/onboardingStore';
import { BottomTabNavigator } from '../BottomTabNavigator';
import { OnboardingContainer } from '@screens/Onboarding';
import { EditProfileScreen } from '@screens/Profile/EditProfileScreen';

const Stack = createNativeStackNavigator<MainAppStackParamList>();

export const MainAppStack = () => {
  const { isCompleted } = useOnboardingStore();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isCompleted ? 'MainBottomTab' : 'Onboarding'}
    >
      <Stack.Screen name="MainBottomTab" component={BottomTabNavigator} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen name="Onboarding">
        {({ navigation }) => (
          <OnboardingContainer
            onComplete={() => navigation.replace('MainBottomTab')}
            onSkip={() => navigation.replace('MainBottomTab')}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

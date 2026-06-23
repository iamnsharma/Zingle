import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@stores';
import { AuthStatus } from '@types';
import { AuthStack } from '../AuthStack';
import { MainAppStack } from '../MainAppStack';

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const RootNavigator = () => {
  const { isAuthenticated, authStatus, setAuthStatus } = useAuthStore();

  // Initialize auth status on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // TODO: Replace with actual auth check from AsyncStorage or Supabase
        // For now, default to unauthenticated (user sees login)

        // Example:
        // const token = await AsyncStorage.getItem('authToken');
        // if (token) {
        //   setAuthStatus(AuthStatus.AUTHENTICATED);
        // } else {
        //   setAuthStatus(AuthStatus.UNAUTHENTICATED);
        // }

        // Default: Set to unauthenticated to show login screen
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
      }
    };

    if (authStatus === AuthStatus.IDLE) {
      initializeAuth();
    }
  }, [authStatus, setAuthStatus]);

  // Show loading while checking auth
  if (authStatus === AuthStatus.IDLE) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="MainAppStack" component={MainAppStack} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

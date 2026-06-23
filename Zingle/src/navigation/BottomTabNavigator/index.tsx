import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useThemeStore } from '@stores';
import { MainBottomTabParamList } from '@types';
import { metrics } from '@styling/metrics';
import { HomeScreen } from '@screens/Home';
import { ProfileScreen } from '@screens/Profile';

const Tab = createBottomTabNavigator<MainBottomTabParamList>();

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Placeholder screens for Discover and Favorites
const DiscoverScreen = () => {
  const { View } = require('react-native');
  const { BaseText } = require('@components/atoms');
  return (
    <View style={styles.placeholderContainer}>
      <BaseText children="Discover Screen - Coming Soon" />
    </View>
  );
};

const FavoritesScreen = () => {
  const { View } = require('react-native');
  const { BaseText } = require('@components/atoms');
  return (
    <View style={styles.placeholderContainer}>
      <BaseText children="Favorites Screen - Coming Soon" />
    </View>
  );
};

export const BottomTabNavigator = () => {
  const { theme } = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          height: metrics.spacing['3xl'] + metrics.spacing.md,
          paddingBottom: metrics.spacing.md,
          paddingTop: metrics.spacing.sm,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.custom.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: metrics.spacing.xs,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: 'Discover',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

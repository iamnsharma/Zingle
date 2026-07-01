import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import type { MainBottomTabParamList } from '@types';
import { metrics } from '@styling/metrics';
import { HomeScreen } from '@screens/Home/SwipeScreen';
import { ChatListScreen } from '@screens/Chat/ListScreen';
import { LikesScreen } from '@screens/Likes';
import { ProfileScreen } from '@screens/Profile/ViewScreen';

const Tab = createBottomTabNavigator<MainBottomTabParamList>();

const TAB_BAR_HEIGHT = 56;

/** Tinder-style tab config: label + outline/filled icon pairs */
const TAB_CONFIG = {
  Home: {
    label: 'Swipe',
    iconOutline: 'cards-outline',
    iconFilled: 'cards',
  },
  Likes: {
    label: 'Likes',
    iconOutline: 'heart-outline',
    iconFilled: 'heart',
  },
  Chat: {
    label: 'Messages',
    iconOutline: 'message-text-outline',
    iconFilled: 'message-text',
  },
  Profile: {
    label: 'Profile',
    iconOutline: 'account-outline',
    iconFilled: 'account',
  },
} as const;

type TabRouteName = keyof typeof TAB_CONFIG;

interface TabBarIconProps {
  routeName: TabRouteName;
  color: string;
  size: number;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  routeName,
  color,
  size,
  focused,
}) => {
  const config = TAB_CONFIG[routeName];
  return (
    <MaterialCommunityIcons
      name={focused ? config.iconFilled : config.iconOutline}
      size={size || 27}
      color={color}
    />
  );
};

type TabIconComponent = NonNullable<BottomTabNavigationOptions['tabBarIcon']>;

const createTabIcon = (routeName: TabRouteName): TabIconComponent => {
  const TabIcon: TabIconComponent = ({ color, size, focused }) => (
    <TabBarIcon
      routeName={routeName}
      color={color}
      size={size}
      focused={focused}
    />
  );
  return TabIcon;
};

const TAB_BAR_ICONS: Record<TabRouteName, TabIconComponent> = {
  Home: createTabIcon('Home'),
  Likes: createTabIcon('Likes'),
  Chat: createTabIcon('Chat'),
  Profile: createTabIcon('Profile'),
};

export const BottomTabNavigator = () => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, metrics.spacing.sm);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name as TabRouteName];
        return {
          headerShown: false,
          title: config.label,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.custom.border,
            borderTopWidth: 1,
            height: TAB_BAR_HEIGHT + bottomInset,
            paddingBottom: bottomInset,
            paddingTop: metrics.spacing.xs,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.custom.textTertiary,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 2,
            letterSpacing: 0.2,
          },
          tabBarIcon: TAB_BAR_ICONS[route.name as TabRouteName],
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Likes" component={LikesScreen} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

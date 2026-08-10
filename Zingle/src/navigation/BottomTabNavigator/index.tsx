import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeStore } from '@stores';
import type { MainBottomTabParamList } from '@types';
import { metrics } from '@styling/metrics';
import { HomeScreen } from '@screens/Home/SwipeScreen';
import { ExploreStack } from '@navigation/ExploreStack';
import { ChatStack } from '@navigation/ChatStack';
import { LikesStack } from '@navigation/LikesStack';
import { ProfileScreen } from '@screens/Profile/ViewScreen';
import { MOCK_CONVERSATIONS } from '@services/mock/data';

const Tab = createBottomTabNavigator<MainBottomTabParamList>();

const TAB_BAR_HEIGHT = 60;
const ICON_SIZE = 24;
const ICON_SIZE_ACTIVE = 26;

/** Premium tab config — Tinder-inspired icon pairs + per-tab accent */
const TAB_CONFIG = {
  Home: {
    label: 'Swipe',
    iconOutline: 'cards-playing-outline',
    iconFilled: 'cards-playing',
    useGoldAccent: false,
  },
  Explore: {
    label: 'Explore',
    iconOutline: 'compass-rose',
    iconFilled: 'compass-rose',
    useGoldAccent: false,
  },
  Likes: {
    label: 'Likes',
    iconOutline: 'star-four-points-outline',
    iconFilled: 'star-four-points',
    useGoldAccent: true,
  },
  Chat: {
    label: 'Messages',
    iconOutline: 'message-text-outline',
    iconFilled: 'message-text',
    useGoldAccent: false,
  },
  Profile: {
    label: 'Profile',
    iconOutline: 'account-circle-outline',
    iconFilled: 'account-circle',
    useGoldAccent: false,
  },
} as const;

type TabRouteName = keyof typeof TAB_CONFIG;

/** Nested screens that should hide the bottom tab bar (full-screen detail views) */
const HIDE_TAB_BAR_ROUTES = [
  'ChatThread',
  'ExploreProfile',
  'ExploreCategory',
  'LikeProfile',
];

const shouldHideTabBar = (
  route: RouteProp<Record<string, object | undefined>, string>,
): boolean => {
  const focused = getFocusedRouteNameFromRoute(route);
  return focused != null && HIDE_TAB_BAR_ROUTES.includes(focused);
};

interface TabBarIconProps {
  routeName: TabRouteName;
  color: string;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  routeName,
  color,
  focused,
}) => {
  const { theme } = useThemeStore();
  const config = TAB_CONFIG[routeName];
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.92)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1 : 0.92,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim]);

  const accentColor = config.useGoldAccent
    ? theme.colors.tertiary
    : theme.colors.primary;

  const iconColor = focused ? accentColor : color;
  const iconName = focused ? config.iconFilled : config.iconOutline;

  const showDot =
    routeName === 'Chat' &&
    MOCK_CONVERSATIONS.some(c => c.unreadCount > 0);

  return (
    <View style={styles.iconSlot}>
      <Animated.View
        style={[
          styles.iconWrap,
          { transform: [{ scale: scaleAnim }] },
          focused && {
            backgroundColor: config.useGoldAccent
              ? theme.colors.tertiary + '22'
              : theme.colors.primary + '18',
          },
        ]}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={focused ? ICON_SIZE_ACTIVE : ICON_SIZE}
          color={iconColor}
        />
        {showDot ? (
          <View
            style={[
              styles.unreadDot,
              {
                backgroundColor: theme.custom.error,
                borderColor: theme.colors.surface,
              },
            ]}
          />
        ) : null}
      </Animated.View>
    </View>
  );
};

type TabIconComponent = NonNullable<BottomTabNavigationOptions['tabBarIcon']>;

const createTabIcon = (routeName: TabRouteName): TabIconComponent => {
  const TabIcon: TabIconComponent = ({ color, focused }) => (
    <TabBarIcon routeName={routeName} color={color} focused={focused} />
  );
  return TabIcon;
};

const TAB_BAR_ICONS: Record<TabRouteName, TabIconComponent> = {
  Home: createTabIcon('Home'),
  Explore: createTabIcon('Explore'),
  Likes: createTabIcon('Likes'),
  Chat: createTabIcon('Chat'),
  Profile: createTabIcon('Profile'),
};

const styles = StyleSheet.create({
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    paddingTop: metrics.spacing.xs,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: metrics.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 4,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
});

export const BottomTabNavigator = () => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, metrics.spacing.sm);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name as TabRouteName];
        const hideTabBar = shouldHideTabBar(route);
        return {
          headerShown: false,
          title: config.label,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 0,
            height: TAB_BAR_HEIGHT + bottomInset,
            paddingBottom: bottomInset,
            paddingTop: metrics.spacing.xs,
            ...metrics.shadows.lg,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            elevation: 12,
            display: hideTabBar ? 'none' : 'flex',
          },
          tabBarActiveTintColor: config.useGoldAccent
            ? theme.colors.tertiary
            : theme.colors.primary,
          tabBarInactiveTintColor: theme.custom.textTertiary,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 0,
            letterSpacing: 0.3,
          },
          tabBarIcon: TAB_BAR_ICONS[route.name as TabRouteName],
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreStack} />
      <Tab.Screen name="Likes" component={LikesStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

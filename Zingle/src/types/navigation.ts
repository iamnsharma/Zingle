import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  ResetPassword: undefined;
};

export type MainBottomTabParamList = {
  Home: undefined;
  Discover: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type MainAppStackParamList = {
  MainBottomTab: undefined;
  ProfileDetail: { userId: string };
  Chat: { conversationId: string };
  MatchedProfiles: undefined;
};

export type RootStackParamList = AuthStackParamList & MainAppStackParamList;

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainAppNavigationProp = NativeStackNavigationProp<MainAppStackParamList>;
export type BottomTabNavigationProp_ = BottomTabNavigationProp<MainBottomTabParamList>;

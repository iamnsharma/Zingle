import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
};

export type MainBottomTabParamList = {
  Home: undefined;
  Likes: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type MainAppStackParamList = {
  MainBottomTab: undefined;
  Onboarding: undefined;
};

export type RootStackParamList = AuthStackParamList & MainAppStackParamList;

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainAppNavigationProp = NativeStackNavigationProp<MainAppStackParamList>;
export type BottomTabNavigationProp_ = BottomTabNavigationProp<MainBottomTabParamList>;

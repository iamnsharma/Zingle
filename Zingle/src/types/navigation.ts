import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Legal: { document: 'terms' | 'privacy' | 'guidelines' };
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatThread: { conversationId: string };
};

export type MainBottomTabParamList = {
  Home: undefined;
  Explore: undefined;
  Likes: undefined;
  Chat: NavigatorScreenParams<ChatStackParamList> | undefined;
  Profile: undefined;
};

export type MainAppStackParamList = {
  MainBottomTab: NavigatorScreenParams<MainBottomTabParamList> | undefined;
  Onboarding: undefined;
  EditProfile: undefined;
  DeleteAccount: undefined;
  HelpSupport: undefined;
  BlockedAccounts: undefined;
  Legal: { document: 'terms' | 'privacy' | 'guidelines' };
};

export type LikesStackParamList = {
  LikesList: undefined;
  LikeProfile: { userId: string };
};

export type ExploreStackParamList = {
  ExploreList: undefined;
  ExploreCategory: { categoryId: string };
  ExploreProfile: { userId: string; categoryId: string };
};

export type RootStackParamList = AuthStackParamList & MainAppStackParamList;

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainAppNavigationProp = NativeStackNavigationProp<MainAppStackParamList>;
export type LikesStackNavigationProp = NativeStackNavigationProp<LikesStackParamList>;
export type ChatStackNavigationProp = NativeStackNavigationProp<ChatStackParamList>;
export type ExploreStackNavigationProp = NativeStackNavigationProp<ExploreStackParamList>;
export type BottomTabNavigationProp_ = BottomTabNavigationProp<MainBottomTabParamList>;

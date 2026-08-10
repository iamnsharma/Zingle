import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
};

export type MainBottomTabParamList = {
  Home: undefined;
  Explore: undefined;
  Likes: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type MainAppStackParamList = {
  MainBottomTab: undefined;
  Onboarding: undefined;
  EditProfile: undefined;
};

export type LikesStackParamList = {
  LikesList: undefined;
  LikeProfile: { userId: string };
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatThread: { conversationId: string };
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

import { create } from 'zustand';
import type { AppSettings, PrivacySettings, UserProfile } from '@types';

export const defaultPrivacySettings: PrivacySettings = {
  showOnApp: true,
  showAge: true,
  showDistance: true,
  matchesOnlyMessages: false,
  hideFromContacts: false,
  readReceipts: true,
  incognitoMode: false,
};

export const defaultAppSettings: AppSettings = {
  pushNotifications: true,
  matchAlerts: true,
  messageAlerts: true,
  likeAlerts: true,
  emailUpdates: false,
  soundEffects: true,
  liquidGlass: false,
};

interface ProfileStoreState {
  currentUser?: UserProfile;
  privacySettings: PrivacySettings;
  appSettings: AppSettings;
  loading: boolean;
  error?: string;

  setCurrentUser: (user: UserProfile | undefined) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  updatePrivacySettings: (updates: Partial<PrivacySettings>) => void;
  updateAppSettings: (updates: Partial<AppSettings>) => void;

  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const useProfileStore = create<ProfileStoreState>((set) => ({
  currentUser: undefined,
  privacySettings: defaultPrivacySettings,
  appSettings: defaultAppSettings,
  loading: false,
  error: undefined,

  setCurrentUser: (user: UserProfile | undefined) =>
    set({
      currentUser: user,
    }),

  updateCurrentUser: (updates: Partial<UserProfile>) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, ...updates }
        : undefined,
    })),

  updatePrivacySettings: (updates: Partial<PrivacySettings>) =>
    set((state) => ({
      privacySettings: { ...state.privacySettings, ...updates },
    })),

  updateAppSettings: (updates: Partial<AppSettings>) =>
    set((state) => ({
      appSettings: { ...state.appSettings, ...updates },
    })),

  setLoading: (loading: boolean) =>
    set({
      loading,
    }),

  setError: (error?: string) =>
    set({
      error,
    }),
}));

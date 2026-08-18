import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  reset: () => void;
}

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    set => ({
      currentUser: undefined,
      privacySettings: defaultPrivacySettings,
      appSettings: defaultAppSettings,
      loading: false,
      error: undefined,

      setCurrentUser: user => set({ currentUser: user }),

      updateCurrentUser: updates =>
        set(state => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...updates, updatedAt: new Date().toISOString() }
            : undefined,
        })),

      updatePrivacySettings: updates =>
        set(state => ({
          privacySettings: { ...state.privacySettings, ...updates },
        })),

      updateAppSettings: updates =>
        set(state => ({
          appSettings: { ...state.appSettings, ...updates },
        })),

      setLoading: loading => set({ loading }),
      setError: error => set({ error }),
      reset: () =>
        set({
          currentUser: undefined,
          privacySettings: defaultPrivacySettings,
          appSettings: defaultAppSettings,
          error: undefined,
        }),
    }),
    {
      name: 'zingle-profile-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        currentUser: state.currentUser,
        privacySettings: state.privacySettings,
        appSettings: state.appSettings,
      }),
    },
  ),
);

import { create } from 'zustand';
import type { UserProfile } from '@types';

interface ProfileStoreState {
  currentUser?: UserProfile;
  loading: boolean;
  error?: string;

  setCurrentUser: (user: UserProfile | undefined) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const useProfileStore = create<ProfileStoreState>((set) => ({
  currentUser: undefined,
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

  setLoading: (loading: boolean) =>
    set({
      loading,
    }),

  setError: (error?: string) =>
    set({
      error,
    }),
}));

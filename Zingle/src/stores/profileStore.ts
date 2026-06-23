import { create } from 'zustand';
import { IProfile } from '@types';

interface ProfileStoreState {
  userProfile: IProfile | null;
  loading: boolean;
  setUserProfile: (profile: IProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStoreState>((set) => ({
  userProfile: null,
  loading: false,
  setUserProfile: (profile: IProfile | null) => set({ userProfile: profile }),
  setLoading: (loading: boolean) => set({ loading }),
  clearProfile: () => set({ userProfile: null, loading: false }),
}));

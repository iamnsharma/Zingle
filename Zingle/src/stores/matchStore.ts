import { create } from 'zustand';
import type { UserProfile } from '@types';
import type { Match, UserLike } from '@types';

interface MatchStoreState {
  matches: Match[];
  likes: UserLike[];
  currentProfile?: UserProfile;
  profiles: UserProfile[];
  loading: boolean;
  error?: string;

  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;
  
  setLikes: (likes: UserLike[]) => void;
  addLike: (like: UserLike) => void;
  
  setProfiles: (profiles: UserProfile[]) => void;
  setCurrentProfile: (profile: UserProfile | undefined) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const useMatchStore = create<MatchStoreState>((set) => ({
  matches: [],
  likes: [],
  currentProfile: undefined,
  profiles: [],
  loading: false,
  error: undefined,

  setMatches: (matches: Match[]) =>
    set({
      matches,
    }),

  addMatch: (match: Match) =>
    set((state) => ({
      matches: [match, ...state.matches],
    })),

  setLikes: (likes: UserLike[]) =>
    set({
      likes,
    }),

  addLike: (like: UserLike) =>
    set((state) => ({
      likes: [like, ...state.likes],
    })),

  setProfiles: (profiles: UserProfile[]) =>
    set({
      profiles,
    }),

  setCurrentProfile: (profile: UserProfile | undefined) =>
    set({
      currentProfile: profile,
    }),

  setLoading: (loading: boolean) =>
    set({
      loading,
    }),

  setError: (error?: string) =>
    set({
      error,
    }),
}));

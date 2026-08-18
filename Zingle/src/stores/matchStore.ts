import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Match, UserLike, UserProfile } from '@types';
import { MOCK_LIKES } from '@services/mock/data';
import { useChatStore } from './chatStore';

export interface PendingMatch {
  profile: UserProfile;
  conversationId: string;
}

const INCOMING_LIKES = MOCK_LIKES.slice(0, 4);

interface MatchStoreState {
  seenIds: string[];
  passedIds: string[];
  likedIds: string[];
  likes: UserLike[];
  matches: Match[];
  pendingMatch: PendingMatch | null;

  recordPass: (profile: UserProfile) => void;
  recordLike: (
    profile: UserProfile,
    type?: 'like' | 'superlike',
  ) => { matched: boolean; conversationId?: string };
  clearPendingMatch: () => void;
  hasSeen: (userId: string) => boolean;
  reset: () => void;
}

const createMatch = (profile: UserProfile): Match => ({
  id: `match-${profile.id}`,
  userId1: 'me',
  userId2: profile.id,
  user1: profile,
  user2: profile,
  createdAt: new Date().toISOString(),
});

export const useMatchStore = create<MatchStoreState>()(
  persist(
    (set, get) => ({
      seenIds: [],
      passedIds: [],
      likedIds: [],
      likes: INCOMING_LIKES,
      matches: [],
      pendingMatch: null,

      recordPass: profile =>
        set(state => ({
          seenIds: state.seenIds.includes(profile.id)
            ? state.seenIds
            : [...state.seenIds, profile.id],
          passedIds: state.passedIds.includes(profile.id)
            ? state.passedIds
            : [...state.passedIds, profile.id],
          likes: state.likes.filter(like => like.userId !== profile.id),
        })),

      recordLike: (profile, type = 'like') => {
        const state = get();
        if (state.matches.some(match => match.userId2 === profile.id)) {
          const conversationId = useChatStore
            .getState()
            .ensureConversation(profile);
          return { matched: true, conversationId };
        }

        const likedMe = state.likes.some(like => like.userId === profile.id);
        const matched = likedMe || type === 'superlike';
        const seenIds = state.seenIds.includes(profile.id)
          ? state.seenIds
          : [...state.seenIds, profile.id];
        const likedIds = state.likedIds.includes(profile.id)
          ? state.likedIds
          : [...state.likedIds, profile.id];

        if (!matched) {
          set({ seenIds, likedIds });
          return { matched: false };
        }

        const conversationId = useChatStore
          .getState()
          .ensureConversation(profile, { intro: true });
        const match = createMatch(profile);

        set({
          seenIds,
          likedIds,
          likes: state.likes.filter(like => like.userId !== profile.id),
          matches: state.matches.some(item => item.id === match.id)
            ? state.matches
            : [match, ...state.matches],
          pendingMatch: { profile, conversationId },
        });

        return { matched: true, conversationId };
      },

      clearPendingMatch: () => set({ pendingMatch: null }),

      hasSeen: userId => get().seenIds.includes(userId),

      reset: () =>
        set({
          seenIds: [],
          passedIds: [],
          likedIds: [],
          likes: INCOMING_LIKES,
          matches: [],
          pendingMatch: null,
        }),
    }),
    {
      name: 'zingle-match-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        seenIds: state.seenIds,
        passedIds: state.passedIds,
        likedIds: state.likedIds,
        likes: state.likes,
        matches: state.matches,
      }),
    },
  ),
);

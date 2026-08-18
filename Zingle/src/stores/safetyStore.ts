import { create } from 'zustand';

interface SafetyStoreState {
  blockedIds: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isBlocked: (userId: string) => boolean;
}

export const useSafetyStore = create<SafetyStoreState>((set, get) => ({
  blockedIds: [],
  blockUser: userId =>
    set(state =>
      state.blockedIds.includes(userId)
        ? state
        : { blockedIds: [...state.blockedIds, userId] },
    ),
  unblockUser: userId =>
    set(state => ({
      blockedIds: state.blockedIds.filter(id => id !== userId),
    })),
  isBlocked: userId => get().blockedIds.includes(userId),
}));

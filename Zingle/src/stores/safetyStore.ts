import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SafetyStoreState {
  blockedIds: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isBlocked: (userId: string) => boolean;
  reset: () => void;
}

export const useSafetyStore = create<SafetyStoreState>()(
  persist(
    (set, get) => ({
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
      reset: () => set({ blockedIds: [] }),
    }),
    {
      name: 'zingle-safety-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

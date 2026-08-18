import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_INVENTORY,
  REFILL_BATCH,
  UNLIMITED,
  getPlanById,
} from '@constants/membership';

interface MembershipState {
  /** Currently owned plan id, or null for a free account. */
  activePlanId: string | null;
  /** Remaining likes. `UNLIMITED` (-1) means unlimited. */
  likes: number;
  superLikes: number;
  boosts: number;
  hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;
  /** Purchase a membership plan — marks it active and fills inventory. */
  purchasePlan: (planId: string) => void;
  purchaseBoosts: (count: number) => void;
  purchaseSuperLikes: (count: number) => void;
  /** Refill likes with the standard batch (for out-of-likes top-ups). */
  refillLikes: () => void;
  /** Try to spend a like. Returns false when none are available. */
  consumeLike: () => boolean;
  consumeSuperLike: () => boolean;
  consumeBoost: () => boolean;
  /** Restore free-tier inventory. Used on account delete. */
  reset: () => void;
}

export const useMembershipStore = create<MembershipState>()(
  persist(
    (set, get) => ({
      activePlanId: null,
      likes: DEFAULT_INVENTORY.likes,
      superLikes: DEFAULT_INVENTORY.superLikes,
      boosts: DEFAULT_INVENTORY.boosts,
      hasHydrated: false,

      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),

      purchasePlan: (planId: string) => {
        const plan = getPlanById(planId);
        if (!plan) return;
        set(state => ({
          activePlanId: planId,
          likes:
            plan.grants.likes === UNLIMITED
              ? UNLIMITED
              : state.likes === UNLIMITED
                ? UNLIMITED
                : state.likes + plan.grants.likes,
          superLikes: state.superLikes + plan.grants.superLikes,
          boosts: state.boosts + plan.grants.boosts,
        }));
      },

      purchaseBoosts: (count: number) =>
        set(state => ({ boosts: state.boosts + count })),

      purchaseSuperLikes: (count: number) =>
        set(state => ({ superLikes: state.superLikes + count })),

      refillLikes: () =>
        set(state => ({
          likes:
            state.likes === UNLIMITED
              ? UNLIMITED
              : state.likes + REFILL_BATCH.likes,
        })),

      consumeLike: () => {
        const { likes } = get();
        if (likes === UNLIMITED) return true;
        if (likes <= 0) return false;
        set({ likes: likes - 1 });
        return true;
      },

      consumeSuperLike: () => {
        const { superLikes } = get();
        if (superLikes <= 0) return false;
        set({ superLikes: superLikes - 1 });
        return true;
      },

      consumeBoost: () => {
        const { boosts } = get();
        if (boosts <= 0) return false;
        set({ boosts: boosts - 1 });
        return true;
      },

      reset: () =>
        set({
          activePlanId: null,
          likes: DEFAULT_INVENTORY.likes,
          superLikes: DEFAULT_INVENTORY.superLikes,
          boosts: DEFAULT_INVENTORY.boosts,
        }),
    }),
    {
      // v2 drops locally "purchased" plans so MVP does not pretend IAP happened.
      name: 'zingle-membership-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        activePlanId: state.activePlanId,
        likes: state.likes,
        superLikes: state.superLikes,
        boosts: state.boosts,
      }),
      onRehydrateStorage: () => () => {
        useMembershipStore.getState().setHasHydrated(true);
      },
    },
  ),
);

/** Derived helper: whether the account currently owns a paid plan. */
export const selectIsPremium = (state: MembershipState): boolean =>
  state.activePlanId !== null;

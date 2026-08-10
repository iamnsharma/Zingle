import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStatus, IUser } from '@types';

interface AuthStoreState {
  authStatus: AuthStatus;
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True once the persisted auth state has been read from storage. */
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  login: (user: IUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      authStatus: AuthStatus.IDLE,
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
      setAuthStatus: (status: AuthStatus) => set({ authStatus: status }),
      setUser: (user: IUser | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      login: (user: IUser, token: string) => {
        set({
          user,
          token,
          authStatus: AuthStatus.AUTHENTICATED,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          authStatus: AuthStatus.UNAUTHENTICATED,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'zingle-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the identity — never the transient `authStatus` flag.
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (_state, error) => {
        // Reconcile the transient status from the restored session and always
        // mark hydration complete (even on error) so the navigator can render.
        const store = useAuthStore.getState();
        if (!error) {
          store.setAuthStatus(
            store.isAuthenticated
              ? AuthStatus.AUTHENTICATED
              : AuthStatus.UNAUTHENTICATED,
          );
        }
        store.setHasHydrated(true);
      },
    },
  ),
);

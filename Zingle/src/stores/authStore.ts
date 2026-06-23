import { create } from 'zustand';
import { AuthStatus, IUser } from '@types';

interface AuthStoreState {
  authStatus: AuthStatus;
  user: IUser | null;
  token: string | null;
  setAuthStatus: (status: AuthStatus) => void;
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  login: (user: IUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  authStatus: AuthStatus.IDLE,
  user: null,
  token: null,
  isAuthenticated: false,
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
}));

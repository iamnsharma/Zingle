import { create } from 'zustand';
import { lightTheme, darkTheme } from '@styling/globalStyles/theme';

interface ThemeStoreState {
  isDark: boolean;
  theme: typeof lightTheme;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  isDark: false,
  theme: lightTheme,
  toggleTheme: () => {
    set((state) => ({
      isDark: !state.isDark,
      theme: !state.isDark ? darkTheme : lightTheme,
    }));
  },
  setTheme: (isDark: boolean) => {
    set({
      isDark,
      theme: isDark ? darkTheme : lightTheme,
    });
  },
}));

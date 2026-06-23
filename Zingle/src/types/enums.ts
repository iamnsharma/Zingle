export enum AuthStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR',
}

export enum BottomTabRoute {
  HOME = 'Home',
  DISCOVER = 'Discover',
  FAVORITES = 'Favorites',
  PROFILE = 'Profile',
}

export enum StorageKeys {
  AUTH_TOKEN = 'auth_token',
  USER_DATA = 'user_data',
  THEME = 'theme',
  LANGUAGE = 'language',
  APP_PREFERENCES = 'app_preferences',
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}

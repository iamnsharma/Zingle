// App-wide constants
export const APP_NAME = 'Zingle';
export const APP_VERSION = '1.0.0';

// API Constants
export const API_TIMEOUT_MS = 30000;
export const API_RETRY_COUNT = 1;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE: 'language',
  FIRST_TIME_LAUNCH: 'first_time_launch',
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_DEBUG_MENU: __DEV__,
} as const;

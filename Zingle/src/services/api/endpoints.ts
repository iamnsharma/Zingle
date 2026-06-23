export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',

  // Users
  USERS_ME: '/users/me',
  USERS_PROFILE: '/users/:id/profile',
  USERS_PROFILE_UPDATE: '/users/profile',

  // Profiles
  PROFILES_DISCOVER: '/profiles/discover',
  PROFILES_DETAIL: '/profiles/:id',

  // Matches
  MATCHES_CREATE: '/matches',
  MATCHES_LIST: '/matches',

  // Messages
  MESSAGES_SEND: '/messages',
  MESSAGES_GET: '/conversations/:conversationId/messages',
};

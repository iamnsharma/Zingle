import Config from 'react-native-config';

export const ENV = {
  NODE_ENV: Config.NODE_ENV || 'development',
  SUPABASE_URL: Config.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: Config.SUPABASE_ANON_KEY || '',
  API_TIMEOUT: parseInt(Config.API_TIMEOUT || '30000', 10),
  ANALYTICS_ENABLED: Config.ANALYTICS_ENABLED === 'true',
  DEBUG_MODE: Config.DEBUG_MODE === 'true',
  isDevelopment: Config.NODE_ENV === 'development',
  isProduction: Config.NODE_ENV === 'production',
};

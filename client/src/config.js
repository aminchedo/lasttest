// client/src/config.js
export const API_BASE_URL = 'http://localhost:30011';

// Environment-based configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || API_BASE_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// API endpoints
export const API_ENDPOINTS = {
  USER_PROFILE: '/api/user/profile',
  SYSTEM_STATUS: '/api/system/status',
  DASHBOARD_STATS: '/api/dashboard/stats',
  RECENT_ACTIVITIES: '/api/activities/recent',
  MODELS: '/api/models',
  HEALTH: '/api/health',
};

export default config;

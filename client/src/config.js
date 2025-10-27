// client/src/config.js

// Environment-based configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE || 'http://localhost:3001/api',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  appName: import.meta.env.VITE_APP_NAME || 'Persian ML Platform',
  appVersion: import.meta.env.VITE_APP_VERSION || '2.5.0',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  enableWebSocket: import.meta.env.VITE_ENABLE_WEBSOCKET === 'true',
  enableBackgroundDownload: import.meta.env.VITE_ENABLE_BACKGROUND_DOWNLOAD !== 'false',
  enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
};

// API endpoints (relative to apiBaseUrl)
export const API_ENDPOINTS = {
  USER_PROFILE: '/user/profile',
  SYSTEM_STATUS: '/system/status',
  DASHBOARD_STATS: '/dashboard/stats',
  RECENT_ACTIVITIES: '/activities/recent',
  MODELS: '/models',
  HEALTH: '/health',
  TRAINING_START: '/training/start',
  TRAINING_STATUS: '/training/status',
  DOWNLOAD_DATASET: '/download/dataset',
  DOWNLOAD_MODEL: '/download/model',
};

// Helper to build full URL
export const getApiUrl = (endpoint) => {
  const base = config.apiBaseUrl.replace(/\/$/, ''); // Remove trailing slash
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

export default config;port default config;

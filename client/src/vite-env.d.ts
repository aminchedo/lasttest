/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_WS_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENABLE_WEBSOCKET: string;
  readonly VITE_ENABLE_BACKGROUND_DOWNLOAD: string;
  readonly VITE_DEV_MODE: string;
  readonly VITE_ENABLE_LOGGING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

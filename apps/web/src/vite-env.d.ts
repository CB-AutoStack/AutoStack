/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_INVENTORY_URL: string;
  readonly VITE_API_VALUATIONS_URL: string;
  readonly VITE_FM_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

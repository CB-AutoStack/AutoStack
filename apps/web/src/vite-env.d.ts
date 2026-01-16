/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROX_API_KEY: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

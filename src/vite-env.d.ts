/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HRIDAY_ADAPTER_MODE?: 'demo' | 'backend';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

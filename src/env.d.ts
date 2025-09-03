/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_ELEVEN_LABS_API_KEY: string;
    readonly VITE_OPENAI_API_KEY: string;
    readonly VITE_PINATA_API_KEY: string;
    readonly VITE_PINATA_SECRET_KEY: string;
    readonly [key: string]: string;
  };
}


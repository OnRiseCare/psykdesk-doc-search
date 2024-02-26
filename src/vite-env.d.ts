/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ELASTICSEARCH_USERNAME: string;
    readonly VITE_ELASTICSEARCH_PASSWORD: string;
    // Add other environment variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

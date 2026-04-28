/// <reference types="vite/client" />

// Typed env vars used by either the guest app or the admin panel.
// Note: only declare vars whose absence is correctly handled at runtime.
// The declared vars here become `string | undefined`; everything else falls
// through to vite/client's default `[key: string]: any` typing.
interface ImportMetaEnv {
  // Admin sign-in
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

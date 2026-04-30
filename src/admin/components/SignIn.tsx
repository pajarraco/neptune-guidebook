import { useEffect, useRef, useState } from "react";
import { api } from "../api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
          prompt?: () => void;
        };
      };
    };
  }
}

interface SignInProps {
  onSignedIn: (email: string) => void;
}

export default function SignIn({ onSignedIn }: SignInProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as
    | string
    | undefined;

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    const tick = setInterval(() => {
      if (cancelled) return;
      if (!window.google?.accounts?.id || !buttonRef.current) return;
      clearInterval(tick);
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          setBusy(true);
          setError(null);
          try {
            const me = await api.authGoogle(response.credential);
            onSignedIn(me.email);
          } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
          } finally {
            setBusy(false);
          }
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
      });
    }, 100);
    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, [clientId, onSignedIn]);

  return (
    <div className="signin-card">
      <h1>Neptune Guidebook Admin</h1>
      <p>Sign in with an authorized Google account to edit content.</p>
      {!clientId && (
        <p className="error">
          <code>VITE_GOOGLE_OAUTH_CLIENT_ID</code> is not configured.
        </p>
      )}
      <div ref={buttonRef} />
      {busy && <p>Verifying…</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

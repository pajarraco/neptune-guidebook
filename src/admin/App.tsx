import { useCallback, useEffect, useState } from "react";
import SignIn from "./components/SignIn";
import Editor from "./components/Editor";
import { api } from "./api";

export default function App() {
  const [email, setEmail] = useState<string | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    api
      .authMe()
      .then((m) => setEmail(m.email))
      .catch(() => setEmail(null))
      .finally(() => setBootstrapping(false));
  }, []);

  const onSignedIn = useCallback((e: string) => setEmail(e), []);
  const onSignOut = useCallback(async () => {
    await api.authLogout();
    setEmail(null);
  }, []);

  if (bootstrapping) {
    return <div className="loading">Loading…</div>;
  }
  if (!email) {
    return <SignIn onSignedIn={onSignedIn} />;
  }
  return <Editor email={email} onSignOut={onSignOut} />;
}

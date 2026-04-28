import { useCallback, useEffect, useState } from "react";
import { api, type LocaleListItem } from "./api";

interface Props {
  email: string;
  onSignOut: () => void;
}

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "saving" }
  | { kind: "pulling" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export default function Editor({ email, onSignOut }: Props) {
  const [languages, setLanguages] = useState<LocaleListItem[]>([]);
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");
  const [original, setOriginal] = useState<string>("");
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  const dirty = draft !== original;

  const loadLanguages = useCallback(async () => {
    setStatus({ kind: "loading" });
    try {
      const { languages } = await api.listLocales();
      setLanguages(languages);
      if (!activeLang && languages.length > 0) {
        setActiveLang(languages[0].lang);
      }
      setStatus({ kind: "idle" });
    } catch (e) {
      setStatus({ kind: "error", message: errMessage(e) });
    }
  }, [activeLang]);

  const loadLocale = useCallback(async (lang: string) => {
    setStatus({ kind: "loading" });
    try {
      const data = await api.readLocale(lang);
      const text = JSON.stringify(data, null, 2);
      setDraft(text);
      setOriginal(text);
      setStatus({ kind: "idle" });
    } catch (e) {
      setStatus({ kind: "error", message: errMessage(e) });
      setDraft("");
      setOriginal("");
    }
  }, []);

  useEffect(() => {
    loadLanguages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeLang) loadLocale(activeLang);
  }, [activeLang, loadLocale]);

  const onSave = useCallback(async () => {
    if (!activeLang) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(draft);
    } catch (e) {
      setStatus({
        kind: "error",
        message: `JSON parse error: ${e instanceof Error ? e.message : String(e)}`,
      });
      return;
    }
    setStatus({ kind: "saving" });
    try {
      await api.writeLocale(activeLang, parsed);
      setOriginal(draft);
      setStatus({ kind: "ok", message: `Saved ${activeLang}.json` });
    } catch (e) {
      setStatus({ kind: "error", message: errMessage(e) });
    }
  }, [activeLang, draft]);

  const onRevert = useCallback(() => {
    setDraft(original);
    setStatus({ kind: "idle" });
  }, [original]);

  const onPull = useCallback(async () => {
    if (
      !confirm(
        "Pull from Google Sheets? This will OVERWRITE the locale JSON files for all languages.",
      )
    )
      return;
    setStatus({ kind: "pulling" });
    try {
      const r = await api.sheetsPull();
      const ok = r.results.filter((x) => x.ok).length;
      setStatus({ kind: "ok", message: `Pulled ${ok}/${r.results.length}` });
      await loadLanguages();
      if (activeLang) await loadLocale(activeLang);
    } catch (e) {
      setStatus({ kind: "error", message: errMessage(e) });
    }
  }, [activeLang, loadLanguages, loadLocale]);

  return (
    <div className="admin-shell">
      <header className="topbar">
        <h1>Guidebook Admin</h1>
        <div className="topbar-right">
          <span className="email">{email}</span>
          <button onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h2>Languages</h2>
          <ul className="lang-list">
            {languages.map((l) => (
              <li key={l.lang}>
                <button
                  className={l.lang === activeLang ? "active" : ""}
                  onClick={() => setActiveLang(l.lang)}
                  disabled={dirty}
                  title={dirty ? "Save or revert your changes first" : ""}
                >
                  <span>{l.lang}</span>
                  {!l.exists && <em> (missing)</em>}
                </button>
              </li>
            ))}
          </ul>
          <hr />
          <button className="secondary" onClick={onPull}>
            Pull from Google Sheets
          </button>
        </aside>

        <main className="content">
          <div className="toolbar">
            <strong>{activeLang ?? "—"}.json</strong>
            <span className="spacer" />
            <button onClick={onRevert} disabled={!dirty}>
              Revert
            </button>
            <button
              className="primary"
              onClick={onSave}
              disabled={!dirty || status.kind === "saving"}
            >
              {status.kind === "saving" ? "Saving…" : "Save"}
            </button>
          </div>

          <StatusBar status={status} />

          <textarea
            className="json-editor"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            placeholder={
              status.kind === "loading" ? "Loading…" : "Select a language"
            }
          />
          <p className="hint">
            Form-based editors are coming next. For now, edit the JSON directly.
            <br />
            Tip: be careful with structure — the guest app expects specific
            keys.
          </p>
        </main>
      </div>
    </div>
  );
}

function StatusBar({ status }: { status: Status }) {
  if (status.kind === "idle" || status.kind === "loading") return null;
  const cls =
    status.kind === "error"
      ? "status error"
      : status.kind === "ok"
        ? "status ok"
        : "status";
  const text =
    status.kind === "saving"
      ? "Saving…"
      : status.kind === "pulling"
        ? "Pulling from Sheets…"
        : status.message;
  return <div className={cls}>{text}</div>;
}

function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

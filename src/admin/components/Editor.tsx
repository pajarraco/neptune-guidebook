import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { api, type LocaleListItem } from "../api";
import { SECTION_REGISTRY } from "./forms/sections";

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

type ViewMode = "form" | "raw";

type LocaleData = Record<string, unknown>;

export default function Editor({ email, onSignOut }: Props) {
  const [languages, setLanguages] = useState<LocaleListItem[]>([]);
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [view, setView] = useState<ViewMode>("form");
  const [activeSection, setActiveSection] = useState<string>(
    SECTION_REGISTRY[0].id,
  );

  // Form state for "Form" view.
  const formMethods = useForm<LocaleData>({
    defaultValues: {},
    shouldUnregister: false,
  });
  const {
    reset,
    getValues,
    formState: { isDirty: formDirty },
  } = formMethods;

  // Raw JSON state.
  const [rawDraft, setRawDraft] = useState("");
  const [rawOriginal, setRawOriginal] = useState("");
  const rawDirty = rawDraft !== rawOriginal;

  // Combined dirty flag.
  const dirty = view === "form" ? formDirty : rawDirty;

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

  const loadLocale = useCallback(
    async (lang: string) => {
      setStatus({ kind: "loading" });
      try {
        const data = await api.readLocale(lang);
        const text = JSON.stringify(data, null, 2);
        reset(data as LocaleData);
        setRawDraft(text);
        setRawOriginal(text);
        setStatus({ kind: "idle" });
      } catch (e) {
        setStatus({ kind: "error", message: errMessage(e) });
        reset({});
        setRawDraft("");
        setRawOriginal("");
      }
    },
    [reset],
  );

  useEffect(() => {
    loadLanguages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeLang) loadLocale(activeLang);
  }, [activeLang, loadLocale]);

  // ---------- Save ----------
  const onSave = useCallback(async () => {
    if (!activeLang) return;
    let payload: LocaleData;
    if (view === "form") {
      payload = getValues();
    } else {
      try {
        payload = JSON.parse(rawDraft);
      } catch (e) {
        setStatus({
          kind: "error",
          message: `JSON parse error: ${e instanceof Error ? e.message : String(e)}`,
        });
        return;
      }
    }
    setStatus({ kind: "saving" });
    try {
      await api.writeLocale(activeLang, payload);
      // Re-sync both views from the saved payload so isDirty resets.
      reset(payload);
      const text = JSON.stringify(payload, null, 2);
      setRawDraft(text);
      setRawOriginal(text);
      setStatus({ kind: "ok", message: `Saved ${activeLang}.json` });
    } catch (e) {
      setStatus({ kind: "error", message: errMessage(e) });
    }
  }, [activeLang, view, getValues, rawDraft, reset]);

  // ---------- Revert ----------
  const onRevert = useCallback(() => {
    if (!activeLang) return;
    loadLocale(activeLang);
  }, [activeLang, loadLocale]);

  // ---------- Pull from Sheets ----------
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
      setStatus({
        kind: "ok",
        message: `Pulled ${ok}/${r.results.length}`,
      });
      await loadLanguages();
      if (activeLang) await loadLocale(activeLang);
    } catch (e) {
      setStatus({ kind: "error", message: errMessage(e) });
    }
  }, [activeLang, loadLanguages, loadLocale]);

  // ---------- View toggle ----------
  // When switching views, sync the destination from the source so the
  // user doesn't lose unsaved edits.
  const onSwitchView = useCallback(
    (next: ViewMode) => {
      if (next === view) return;
      if (next === "raw") {
        // form → raw: serialize current form values
        const text = JSON.stringify(getValues(), null, 2);
        setRawDraft(text);
      } else {
        // raw → form: parse and reset form
        try {
          const parsed = JSON.parse(rawDraft);
          reset(parsed);
        } catch {
          // If raw is invalid JSON, just don't import; user keeps form state.
          setStatus({
            kind: "error",
            message:
              "Raw JSON is invalid; switched to form view without importing.",
          });
        }
      }
      setView(next);
    },
    [view, getValues, rawDraft, reset],
  );

  // ---------- Active section component ----------
  const ActiveSectionComponent = useMemo(
    () =>
      SECTION_REGISTRY.find((s) => s.id === activeSection)?.Component ??
      SECTION_REGISTRY[0].Component,
    [activeSection],
  );

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
            <div className="view-toggle" role="tablist">
              <button
                className={view === "form" ? "active" : ""}
                onClick={() => onSwitchView("form")}
              >
                Form
              </button>
              <button
                className={view === "raw" ? "active" : ""}
                onClick={() => onSwitchView("raw")}
              >
                Raw JSON
              </button>
            </div>
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

          {view === "form" ? (
            <FormProvider {...formMethods}>
              <div className="section-tabs" role="tablist">
                {SECTION_REGISTRY.map((s) => (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={s.id === activeSection}
                    className={s.id === activeSection ? "active" : ""}
                    onClick={() => setActiveSection(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <form
                className="form-body"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSave();
                }}
              >
                <ActiveSectionComponent />
              </form>
            </FormProvider>
          ) : (
            <textarea
              className="json-editor"
              value={rawDraft}
              onChange={(e) => setRawDraft(e.target.value)}
              spellCheck={false}
              placeholder={
                status.kind === "loading" ? "Loading…" : "Select a language"
              }
            />
          )}
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

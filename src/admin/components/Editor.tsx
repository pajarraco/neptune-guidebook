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

  // Manual dirty flag for the form view — RHF's isDirty is unreliable when
  // useFieldArray is present (arrays re-register on mount and immediately
  // mark the form dirty even after reset()).
  const [formDirty, setFormDirty] = useState(false);

  // Form state for "Form" view.
  const formMethods = useForm<LocaleData>({
    defaultValues: {},
    shouldUnregister: false,
  });
  const { reset, getValues } = formMethods;

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
        setFormDirty(false);
        setRawDraft(text);
        setRawOriginal(text);
        setStatus({ kind: "idle" });
      } catch (e) {
        setStatus({ kind: "error", message: errMessage(e) });
        reset({});
        setFormDirty(false);
        setRawDraft("");
        setRawOriginal("");
      }
    },
    [reset],
  );

  useEffect(() => {
    // Bootstrap fetch on mount. The "loading" setState inside loadLanguages
    // is synchronous on purpose so the UI shows a spinner immediately;
    // react-hooks/set-state-in-effect (when enabled) is overly strict for
    // data-fetching effects.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLanguages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Same rationale as above.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      reset(payload as LocaleData);
      setFormDirty(false);
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

  // ---------- Push to Sheets ----------
  const onPush = useCallback(async () => {
    if (
      !confirm(
        "Push English to Google Sheets? This will OVERWRITE the 'en' tab with your current en.json file.",
      )
    )
      return;
    setStatus({ kind: "pulling" });
    try {
      const r = await api.sheetsPush();
      const ok = r.results.filter((x) => x.ok).length;
      setStatus({
        kind: "ok",
        message: `Pushed ${ok}/${r.results.length}`,
      });
    } catch (e) {
      setStatus({ kind: "error", message: errMessage(e) });
    }
  }, []);

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
        // raw → form: parse and update baseline so form re-renders cleanly
        try {
          const parsed = JSON.parse(rawDraft);
          reset(parsed);
          setFormDirty(false);
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
          {view === "form" && (
            <nav
              className="sidebar-group sidebar-sections"
              aria-label="Sections"
            >
              <span className="sidebar-label">Sections</span>
              <ul className="section-nav">
                {SECTION_REGISTRY.map((s) => (
                  <li key={s.id}>
                    <button
                      className={s.id === activeSection ? "active" : ""}
                      onClick={() => setActiveSection(s.id)}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="sidebar-footer">
            <div className="sidebar-group">
              <label className="sidebar-label" htmlFor="lang-select">
                Language
              </label>
              <select
                id="lang-select"
                className="lang-select"
                value={activeLang ?? ""}
                onChange={(e) => setActiveLang(e.target.value || null)}
                disabled={dirty || languages.length === 0}
                title={dirty ? "Save or revert your changes first" : ""}
              >
                {languages.length === 0 && <option value="">Loading…</option>}
                {languages.map((l) => (
                  <option key={l.lang} value={l.lang}>
                    {l.lang}
                    {!l.exists ? " (missing)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button className="secondary" onClick={onPull}>
              Pull from Google Sheets
            </button>
            <button className="secondary" onClick={onPush}>
              Push English to Sheets
            </button>
          </div>
        </aside>

        <main className="content">
          <div className="toolbar">
            <strong>{activeLang ?? "—"}.json</strong>
            {view === "form" && activeSection && (
              <span className="toolbar-section">
                › {SECTION_REGISTRY.find((s) => s.id === activeSection)?.label}
              </span>
            )}
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
              <form
                className="form-body"
                onChange={() => setFormDirty(true)}
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

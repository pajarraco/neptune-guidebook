import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { api, type LocaleListItem } from "../api";
import { SECTION_REGISTRY, SETTINGS_REGISTRY } from "./Router";

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

type LocaleData = Record<string, unknown>;

export default function Editor({ email, onSignOut }: Props) {
  const [languages, setLanguages] = useState<LocaleListItem[]>([]);
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "loading" });
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

  // Combined dirty flag.
  const dirty = formDirty;

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
        // If settings section, load config.json instead of locale
        const data =
          activeSection === "settings"
            ? await api.readSetting("config")
            : await api.readLocale(lang);
        reset(data as LocaleData);
        setFormDirty(false);
        setStatus({ kind: "idle" });
      } catch (e) {
        setStatus({ kind: "error", message: errMessage(e) });
        reset({});
        setFormDirty(false);
      }
    },
    [reset, activeSection],
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
    if (activeSection === "settings") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadLocale("en"); // Language doesn't matter for settings
    } else if (activeLang) {
      loadLocale(activeLang);
    }
  }, [activeSection, activeLang, loadLocale]);

  // ---------- Save ----------
  const onSave = useCallback(async () => {
    if (activeSection !== "settings" && !activeLang) return;
    const payload = getValues();
    setStatus({ kind: "saving" });
    try {
      // If settings section, write to config.json instead of locale
      if (activeSection === "settings") {
        await api.writeSetting("config", payload);
        setStatus({ kind: "ok", message: "Saved config.json" });
      } else {
        await api.writeLocale(activeLang!, payload);
        setStatus({ kind: "ok", message: `Saved ${activeLang}.json` });
      }
      // Re-sync from the saved payload so isDirty resets.
      reset(payload as LocaleData);
      setFormDirty(false);
    } catch (e) {
      setStatus({ kind: "error", message: errMessage(e) });
    }
  }, [activeLang, getValues, reset, activeSection]);

  // ---------- Revert ----------
  const onRevert = useCallback(() => {
    if (activeSection === "settings") {
      // Reload config without needing a language
      loadLocale("en"); // Language doesn't matter for settings
      return;
    }
    if (!activeLang) return;
    loadLocale(activeLang);
  }, [activeSection, activeLang, loadLocale]);

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

  // ---------- Active section component ----------
  const ActiveSectionComponent = useMemo(
    () =>
      SECTION_REGISTRY.find((s) => s.id === activeSection)?.Component ??
      SETTINGS_REGISTRY.find((s) => s.id === activeSection)?.Component ??
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
          <nav className="sidebar-group sidebar-sections" aria-label="Sections">
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

            <span className="sidebar-label">Settings</span>
            <ul className="section-nav">
              {SETTINGS_REGISTRY.map((s) => (
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

          <div className="sidebar-footer">
            <div className="sidebar-group">
              {activeSection !== "settings" && (
                <>
                  <label className="sidebar-label" htmlFor="lang-select">
                    Language
                  </label>
                  <select
                    id="lang-select"
                    className="lang-select"
                    value={activeLang ?? ""}
                    onChange={(e) => setActiveLang(e.target.value || null)}
                    disabled={
                      dirty ||
                      languages.length === 0 ||
                      activeSection === "settings"
                    }
                    title={dirty ? "Save or revert your changes first" : ""}
                  >
                    {languages.length === 0 && (
                      <option value="">Loading…</option>
                    )}
                    {languages.map((l) => (
                      <option key={l.lang} value={l.lang}>
                        {l.lang}
                        {!l.exists ? " (missing)" : ""}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            {activeSection !== "settings" && (
              <>
                <button className="secondary" onClick={onPull}>
                  Pull from Google Sheets
                </button>
                <button className="secondary" onClick={onPush}>
                  Push English to Sheets
                </button>
              </>
            )}
          </div>
        </aside>

        <main className="content">
          <div className="toolbar">
            <strong>
              {activeSection === "settings"
                ? "config.json"
                : `${activeLang ?? "—"}.json`}
            </strong>
            {activeSection && (
              <span className="toolbar-section">
                ›
                {SECTION_REGISTRY.find((s) => s.id === activeSection)?.label ??
                  SETTINGS_REGISTRY.find((s) => s.id === activeSection)?.label}
              </span>
            )}
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

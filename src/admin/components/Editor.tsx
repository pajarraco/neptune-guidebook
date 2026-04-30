import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { api, type LocaleListItem } from "../api";
import { SECTION_REGISTRY, SETTINGS_REGISTRY } from "./Router";
import type { EditorProps, LocaleData, Status } from "../../../types/admin";
import TopBanner from "./editor/TopBanner";
import SidebarMenu from "./editor/SidebarMenu";
import SidebarFooter from "./editor/SidebarFooter";
import ContentForm from "./editor/ContentForm";

export default function Editor({ email, onSignOut }: EditorProps) {
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
      <TopBanner email={email} onSignOut={onSignOut} />

      <div className="layout">
        <aside className="sidebar">
          <SidebarMenu
            activeSection={activeSection}
            onSetActiveSection={setActiveSection}
          />
          <SidebarFooter
            activeSection={activeSection}
            activeLang={activeLang}
            languages={languages}
            dirty={dirty}
            onSetActiveLang={setActiveLang}
            onPull={onPull}
            onPush={onPush}
          />
        </aside>

        <ContentForm
          activeSection={activeSection}
          activeLang={activeLang}
          status={status}
          formMethods={formMethods}
          ActiveSectionComponent={ActiveSectionComponent}
          onSave={onSave}
          onRevert={onRevert}
          onFormChange={() => setFormDirty(true)}
          dirty={dirty}
        />
      </div>
    </div>
  );
}

function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

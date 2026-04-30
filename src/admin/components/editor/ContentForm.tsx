import { FormProvider, type UseFormReturn } from "react-hook-form";
import { SECTION_REGISTRY, SETTINGS_REGISTRY } from "../Router";
import type { LocaleData, Status } from "../../../../types/admin";

interface ContentFormProps {
  activeSection: string;
  activeLang: string | null;
  status: Status;
  formMethods: UseFormReturn<LocaleData>;
  ActiveSectionComponent: React.ComponentType;
  onSave: () => void;
  onRevert: () => void;
  onFormChange: () => void;
  dirty: boolean;
}

export default function ContentForm({
  activeSection,
  activeLang,
  status,
  formMethods,
  ActiveSectionComponent,
  onSave,
  onRevert,
  onFormChange,
  dirty,
}: ContentFormProps) {
  return (
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
          onChange={onFormChange}
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <ActiveSectionComponent />
        </form>
      </FormProvider>
    </main>
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

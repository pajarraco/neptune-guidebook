import type { LocaleListItem } from "../../api";

interface SidebarFooterProps {
  activeSection: string;
  activeLang: string | null;
  languages: LocaleListItem[];
  dirty: boolean;
  onSetActiveLang: (lang: string | null) => void;
  onPull: () => void;
  onPush: () => void;
}

export default function SidebarFooter({
  activeSection,
  activeLang,
  languages,
  dirty,
  onSetActiveLang,
  onPull,
  onPush,
}: SidebarFooterProps) {
  return (
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
              onChange={(e) => onSetActiveLang(e.target.value || null)}
              disabled={
                dirty || languages.length === 0 || activeSection === "settings"
              }
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
  );
}

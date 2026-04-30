import { SECTION_REGISTRY, SETTINGS_REGISTRY } from "../Router";

interface SidebarMenuProps {
  activeSection: string;
  onSetActiveSection: (id: string) => void;
}

export default function SidebarMenu({
  activeSection,
  onSetActiveSection,
}: SidebarMenuProps) {
  return (
    <nav className="sidebar-group sidebar-sections" aria-label="Sections">
      <span className="sidebar-label">Sections</span>
      <ul className="section-nav">
        {SECTION_REGISTRY.map((s) => (
          <li key={s.id}>
            <button
              className={s.id === activeSection ? "active" : ""}
              onClick={() => onSetActiveSection(s.id)}
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
              onClick={() => onSetActiveSection(s.id)}
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

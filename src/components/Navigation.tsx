import type { GuideSection } from '../types';

interface NavigationProps {
  sections: GuideSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export default function Navigation({ sections, activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="material-symbols-outlined nav-icon">{section.icon}</span>
            <span className="nav-title">{section.title}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

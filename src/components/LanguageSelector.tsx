import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="language-selector">
      <div className="language-selector-label">
        <span className="material-icons">language</span>
      </div>
      <div className="language-options">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
            onClick={() => changeLanguage(lang.code)}
            title={lang.name}
          >
            <span className="flag">{lang.flag}</span>
            <span className="lang-code">{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useTranslation } from "react-i18next";

export default function HouseRulesSection() {
  const { t } = useTranslation();
  const rules = t('houseRules.rules', { returnObjects: true }) as Array<{icon: string; title: string; description: string}>;

  return (
    <div className="section-content">
      <h2>{t('sections.houseRules')}</h2>

      <div className="rules-grid">
        {rules.map((rule, index) => (
          <div key={index} className="rule-card">
            <span className="material-symbols-outlined rule-icon">
              {rule.icon}
            </span>
            <h4>{rule.title}</h4>
            <p>{rule.description}</p>
          </div>
        ))}
      </div>

      <div className="important-note">
        <h3>{t('houseRules.importantNote.title')}</h3>
        <p>{t('houseRules.importantNote.message')}</p>
      </div>
    </div>
  );
}

import { useTranslation } from "react-i18next";

export default function HouseRulesSection() {
  const { t } = useTranslation();
  const rules = t('houseRules.rules', { returnObjects: true }) as Array<{title: string; description: string}>;
  const ruleIcons = ['smoking_rooms', 'pets', 'volume_up', 'event', 'cleaning_services', 'recycling'];

  return (
    <div className="section-content">
      <h2>{t('sections.houseRules')}</h2>

      <div className="rules-grid">
        {rules.map((rule, index) => (
          <div key={index} className="rule-card">
            <span className="material-symbols-outlined rule-icon">
              {ruleIcons[index] || 'info'}
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

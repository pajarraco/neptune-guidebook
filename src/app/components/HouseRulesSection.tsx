import { useTranslation } from "react-i18next";

export default function HouseRulesSection() {
  const { t } = useTranslation();
  const rules = t("houseRules.rules", { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;
  const ruleIcons = [
    "house",
    "smoking_rooms",
    "volume_up",
    "event",
    "cleaning_services",
    "recycling",
    "pool",
    "garage",
    "pets",
  ];

  return (
    <div className="section-content">
      <h1>{t("sections.houseRules")}</h1>

      <div className="rules-grid">
        {rules.map((rule, index) => (
          <div key={index} className="rule-card">
            <span className="material-symbols-outlined rule-icon">
              {ruleIcons[index] || "info"}
            </span>
            <h4>{rule.title}</h4>
            <p dangerouslySetInnerHTML={{ __html: rule.description }} />
          </div>
        ))}
      </div>

      <div className="important-note">
        <h3>{t("houseRules.importantNote.title")}</h3>
        <p
          dangerouslySetInnerHTML={{
            __html: t("houseRules.importantNote.message"),
          }}
        />
      </div>
    </div>
  );
}

import { useTranslation } from "react-i18next";

export default function AmenitiesSection() {
  const { t } = useTranslation();
  const amenities = t("amenities", { returnObjects: true }) as Array<{
    name: string;
    description: string;
    instructions?: string;
  }>;

  return (
    <div className="section-content">
      <h1>{t("amenitiesSection.sectionTitle")}</h1>

      <div className="amenities-list">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <h3>{amenity.name}</h3>
            <p className="amenity-description">{amenity.description}</p>

            {amenity.instructions && (
              <p className="amenity-instructions">
                <strong>{t("amenitiesSection.howToUseLabel")}</strong>{" "}
                {amenity.instructions}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="tip-box">
        <strong>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1.25rem",
              verticalAlign: "middle",
              marginRight: "0.25rem",
              color: "var(--sand-color)",
            }}
          >
            lightbulb
          </span>
          {t("amenitiesSection.helpTip.title")}
        </strong>{" "}
        {t("amenitiesSection.helpTip.message")}
      </div>
    </div>
  );
}

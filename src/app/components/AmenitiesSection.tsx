import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { api } from "../api";

export default function AmenitiesSection() {
  const { t } = useTranslation();
  const amenities = t("amenities", { returnObjects: true }) as Array<{
    name: string;
    description: string;
    instructions?: string;
  }>;
  const [amenityIcons, setAmenityIcons] = useState<string[]>([]);

  useEffect(() => {
    api
      .readConfig()
      .then((data) => setAmenityIcons(data.amenityIcons || []))
      .catch((err) => console.error("Failed to load config:", err));
  }, []);

  if (amenityIcons.length === 0) {
    return null; // Don't render until config is loaded
  }

  return (
    <div className="section-content">
      <h1>{t("amenitiesSection.sectionTitle")}</h1>

      <div className="amenities-list">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <h3>
              <span className="material-symbols-outlined icon-2xl icon-inline icon-sand">
                {amenityIcons[index] || "info"}
              </span>
              {amenity.name}
            </h3>
            <p
              className="amenity-description"
              dangerouslySetInnerHTML={{ __html: amenity.description }}
            />

            {amenity.instructions && (
              <p className="amenity-instructions">
                <strong>{t("amenitiesSection.howToUseLabel")}</strong>
                <span
                  dangerouslySetInnerHTML={{ __html: amenity.instructions }}
                />
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="tip-box">
        <strong>
          <span className="material-symbols-outlined icon-base icon-middle icon-mr-xs icon-sand">
            lightbulb
          </span>
          {t("amenitiesSection.helpTip.title")}
        </strong>{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: t("amenitiesSection.helpTip.message"),
          }}
        />
      </div>
    </div>
  );
}

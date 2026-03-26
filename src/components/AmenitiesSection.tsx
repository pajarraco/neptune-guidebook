import guidebookDataRaw from "../assets/guidebook-data.json";
import type { GuidebookData } from "../types";

const guidebookData = guidebookDataRaw as GuidebookData;

export default function AmenitiesSection() {
  const { amenities, amenitiesSection } = guidebookData;

  return (
    <div className="section-content">
      <h2>{amenitiesSection.sectionTitle}</h2>

      <div className="amenities-list">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <h3>{amenity.name}</h3>
            <p className="amenity-description">{amenity.description}</p>

            {amenity.items && amenity.items.length > 0 && (
              <ul style={{ marginTop: "0.75rem", marginLeft: "1.5rem" }}>
                {amenity.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "0.25rem" }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {amenity.serviceInfo && (
              <p
                className="amenity-instructions"
                style={{
                  backgroundColor: "#fef3c7",
                  borderLeft: "4px solid #f59e0b",
                }}
              >
                <strong>{amenitiesSection.serviceInfoLabel}</strong> {amenity.serviceInfo}
              </p>
            )}

            {amenity.instructions && (
              <p className="amenity-instructions">
                <strong>{amenitiesSection.howToUseLabel}</strong> {amenity.instructions}
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
          {amenitiesSection.helpTip.title}
        </strong>{" "}
        {amenitiesSection.helpTip.message}
      </div>
    </div>
  );
}

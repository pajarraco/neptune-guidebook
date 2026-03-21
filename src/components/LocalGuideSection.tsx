import guidebookDataRaw from "../assets/guidebook-data.json";
import type { GuidebookData } from "../types";

const guidebookData = guidebookDataRaw as GuidebookData;

export default function LocalGuideSection() {
  const { localGuide } = guidebookData;
  const categories = Array.from(
    new Set(localGuide.recommendations.map((r) => r.category)),
  );

  return (
    <div className="section-content">
      <h2>Local Area Guide</h2>

      {categories.map((category) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="recommendations-grid">
            {localGuide.recommendations
              .filter((r) => r.category === category)
              .map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <h4>{rec.name}</h4>
                  <p className="rec-description">{rec.description}</p>
                  {rec.address && (
                    <p className="rec-address">
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "0.9rem",
                          verticalAlign: "middle",
                          marginRight: "0.25rem",
                        }}
                      >
                        location_on
                      </span>
                      {rec.address}
                    </p>
                  )}
                  {rec.distance && (
                    <p className="rec-distance">
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "0.9rem",
                          verticalAlign: "middle",
                          marginRight: "0.25rem",
                        }}
                      >
                        directions_walk
                      </span>
                      {rec.distance}
                    </p>
                  )}
                  {rec.link && (
                    <a
                      href={rec.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginTop: "0.75rem",
                        color: "var(--primary-color)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1.1rem", marginRight: "0.25rem" }}
                      >
                        map
                      </span>
                      View on Google Maps
                    </a>
                  )}
                  {rec.note && (
                    <p
                      style={{
                        marginTop: "0.5rem",
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                      }}
                    >
                      {rec.note}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      {localGuide.packingList && (
        <div className="instruction-block" style={{ marginTop: "2rem" }}>
          <h3>🎒 {localGuide.packingList.title}</h3>
          <p style={{ marginBottom: "1rem" }}>
            We've got you covered with the basics, but here are a few essentials
            you might want to bring:
          </p>
          <div className="recommendations-grid">
            {localGuide.packingList.items.map((item: string, index: number) => (
              <div
                key={index}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "var(--background)",
                  borderRadius: "6px",
                }}
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {localGuide.tip && (
        <div className="tip-box">
          <p>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
              }}
            >
              info
            </span>
            {localGuide.tip}
          </p>
        </div>
      )}
    </div>
  );
}

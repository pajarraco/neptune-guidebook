import { useTranslation } from "react-i18next";

export default function LocalGuideSection() {
  const { t } = useTranslation();
  const recommendations = t('localGuide.recommendations', { returnObjects: true }) as Array<{category: string; name: string; description: string; address?: string; distance?: string; link?: string; note?: string}>;
  const categories = Array.from(
    new Set(recommendations.map((r) => r.category)),
  );

  return (
    <div className="section-content">
      <h2>{t('localGuide.sectionTitle')}</h2>

      {categories.map((category) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="recommendations-grid">
            {recommendations
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
                          fontSize: "1.125rem",
                          verticalAlign: "middle",
                          marginRight: "0.25rem",
                          color: "var(--sand-color)",
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
                          fontSize: "1.125rem",
                          verticalAlign: "middle",
                          marginRight: "0.25rem",
                          color: "var(--sand-color)",
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
                        style={{
                          fontSize: "1.375rem",
                          marginRight: "0.25rem",
                          color: "var(--sand-color)",
                        }}
                      >
                        map
                      </span>
                      {t('localGuide.viewOnMapsLabel')}
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

      <div className="tip-box">
        <p>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1.25rem",
              verticalAlign: "middle",
              marginRight: "0.5rem",
              color: "var(--sand-color)",
            }}
          >
            info
          </span>
          {t('localGuide.tip')}
        </p>
      </div>
    </div>
  );
}

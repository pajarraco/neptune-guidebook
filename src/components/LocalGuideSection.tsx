import guidebookData from '../assets/guidebook-data.json';

export default function LocalGuideSection() {
  const { localGuide } = guidebookData;
  const categories = Array.from(new Set(localGuide.recommendations.map(r => r.category)));

  return (
    <div className="section-content">
      <h2>Local Area Guide</h2>
      
      {categories.map(category => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="recommendations-grid">
            {localGuide.recommendations
              .filter(r => r.category === category)
              .map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <h4>{rec.name}</h4>
                  <p className="rec-description">{rec.description}</p>
                  {rec.address && <p className="rec-address">📍 {rec.address}</p>}
                  {rec.distance && <p className="rec-distance">🚶 {rec.distance}</p>}
                  {rec.note && (
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      {rec.note}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      {localGuide.packingList && (
        <div className="instruction-block" style={{ marginTop: '2rem' }}>
          <h3>🎒 {localGuide.packingList.title}</h3>
          <p style={{ marginBottom: '1rem' }}>We've got you covered with the basics, but here are a few essentials you might want to bring:</p>
          <div className="recommendations-grid">
            {localGuide.packingList.items.map((item, index) => (
              <div key={index} style={{ padding: '0.5rem', backgroundColor: 'var(--background)', borderRadius: '6px' }}>
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tip-box">
        <strong>{localGuide.tip}</strong>
      </div>
    </div>
  );
}

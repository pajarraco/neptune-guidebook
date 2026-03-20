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
                </div>
              ))}
          </div>
        </div>
      ))}

      <div className="tip-box">
        <strong>{localGuide.tip}</strong>
      </div>
    </div>
  );
}

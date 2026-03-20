import guidebookData from '../assets/guidebook-data.json';

export default function AmenitiesSection() {
  const { amenities } = guidebookData;

  return (
    <div className="section-content">
      <h2>Amenities & Appliances</h2>
      
      <div className="amenities-list">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <h3>{amenity.name}</h3>
            <p className="amenity-description">{amenity.description}</p>
            
            {amenity.items && amenity.items.length > 0 && (
              <ul style={{ marginTop: '0.75rem', marginLeft: '1.5rem' }}>
                {amenity.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{item}</li>
                ))}
              </ul>
            )}
            
            {amenity.serviceInfo && (
              <p className="amenity-instructions" style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
                <strong>Service Info:</strong> {amenity.serviceInfo}
              </p>
            )}
            
            {amenity.instructions && (
              <p className="amenity-instructions">
                <strong>How to use:</strong> {amenity.instructions}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="tip-box">
        <strong>💡 Need help?</strong> If you experience any issues with appliances or amenities, don't hesitate to get in touch.
      </div>
    </div>
  );
}

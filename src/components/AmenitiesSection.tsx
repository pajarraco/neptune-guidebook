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
            {amenity.instructions && (
              <p className="amenity-instructions">
                <strong>How to use:</strong> {amenity.instructions}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="tip-box">
        <strong>💡 Need help?</strong> Instruction manuals for all appliances are in the kitchen drawer.
      </div>
    </div>
  );
}

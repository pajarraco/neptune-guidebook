interface PropertyInfo {
  name: string;
  address: string;
  wifi: {
    network: string;
    password: string;
  };
  checkIn: string;
  checkOut: string;
}

interface PropertyInfoSectionProps {
  info: PropertyInfo;
}

export default function PropertyInfoSection({ info }: PropertyInfoSectionProps) {
  return (
    <div className="section-content">
      <div className="welcome-header">
        <h1>{info.name}</h1>
        <p className="address">{info.address}</p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>📍 Check-in</h3>
          <p className="highlight">{info.checkIn}</p>
        </div>
        <div className="info-card">
          <h3>📍 Check-out</h3>
          <p className="highlight">{info.checkOut}</p>
        </div>
      </div>

      <div className="wifi-section">
        <h3>📶 WiFi Information</h3>
        <div className="wifi-details">
          <div className="wifi-item">
            <span className="label">Network:</span>
            <span className="value">{info.wifi.network}</span>
          </div>
          <div className="wifi-item">
            <span className="label">Password:</span>
            <span className="value password">{info.wifi.password}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

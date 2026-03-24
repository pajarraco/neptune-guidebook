import type { PropertyInfo } from "../types";

interface PropertyInfoSectionProps {
  info: PropertyInfo;
  onNavigate: (sectionId: string) => void;
}

export default function PropertyInfoSection({
  info,
  onNavigate,
}: PropertyInfoSectionProps) {
  const apartmentNumber = import.meta.env.VITE_APARTMENT_NUMBER || "";
  const wifiNetwork = import.meta.env.VITE_WIFI_NETWORK || info.wifi.network;
  const wifiPassword = import.meta.env.VITE_WIFI_PASSWORD || info.wifi.password;

  const fullAddress = info.address.replace(
    "{{APARTMENT_NUMBER}}",
    apartmentNumber,
  );

  const handleNavigateToCheckInOut = () => {
    onNavigate("check-in-out");
  };

  return (
    <div className="section-content">
      <div className="welcome-header">
        <h1>Address</h1>
        <p className="address">{fullAddress}</p>
      </div>

      <div className="info-grid">
        <div className="info-card" onClick={handleNavigateToCheckInOut} style={{ cursor: "pointer" }}>
          <h3>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
              }}
            >
              schedule
            </span>
            Check-in
          </h3>
          <p className="highlight">{info.checkIn}</p>
        </div>
        <div className="info-card" onClick={handleNavigateToCheckInOut} style={{ cursor: "pointer" }}>
          <h3>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
              }}
            >
              schedule
            </span>
            Check-out
          </h3>
          <p className="highlight">{info.checkOut}</p>
        </div>
      </div>

      <div className="wifi-section">
        <h3>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1.25rem",
              verticalAlign: "middle",
              marginRight: "0.5rem",
            }}
          >
            wifi
          </span>
          WiFi Information
        </h3>
        <div className="wifi-details">
          <div className="wifi-item">
            <span className="label">Network:</span>
            <span className="value">{wifiNetwork}</span>
          </div>
          <div className="wifi-item">
            <span className="label">Password:</span>
            <span className="value password">{wifiPassword}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

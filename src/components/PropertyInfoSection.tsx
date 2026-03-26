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

  const handleNavigateToCheckIn = () => {
    onNavigate("check-in-out");
  };

  const handleNavigateToCheckOut = () => {
    onNavigate("check-in-out");
    // Wait for navigation to complete, then scroll to checkout section
    setTimeout(() => {
      const checkoutSection = document.getElementById("checkout-section");
      if (checkoutSection) {
        const navigation = document.querySelector(".navigation");
        const navHeight = navigation?.getBoundingClientRect().height || 0;
        const elementPosition = checkoutSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  return (
    <div className="section-content">
      <div className="welcome-header">
        <h1>{info.addressTitle}</h1>
        <p className="address">{fullAddress}</p>
      </div>

      <div className="info-grid">
        <div
          className="info-card"
          onClick={handleNavigateToCheckIn}
          style={{ cursor: "pointer" }}
        >
          <h3>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.25rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
                color: "var(--sand-color)",
              }}
            >
              schedule
            </span>
            {info.checkInLabel}
          </h3>
          <p className="highlight">{info.checkIn}</p>
        </div>
        <div
          className="info-card"
          onClick={handleNavigateToCheckOut}
          style={{ cursor: "pointer" }}
        >
          <h3>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.25rem",
                verticalAlign: "middle",
                marginRight: "0.5rem",
                color: "var(--sand-color)",
              }}
            >
              schedule
            </span>
            {info.checkOutLabel}
          </h3>
          <p className="highlight">{info.checkOut}</p>
        </div>
      </div>

      <div className="wifi-section">
        <h3>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1.5625rem",
              verticalAlign: "middle",
              marginRight: "0.5rem",
              color: "var(--sand-color)",
            }}
          >
            wifi
          </span>
          {info.wifi.title}
        </h3>
        <div className="wifi-details">
          <div className="wifi-item">
            <span className="label">{info.wifi.networkLabel}</span>
            <span className="value">{wifiNetwork}</span>
          </div>
          <div className="wifi-item">
            <span className="label">{info.wifi.passwordLabel}</span>
            <span className="value password">{wifiPassword}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

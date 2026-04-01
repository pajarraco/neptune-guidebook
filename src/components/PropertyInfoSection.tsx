import { useTranslation } from "react-i18next";

interface PropertyInfoSectionProps {
  onNavigate: (sectionId: string) => void;
}

export default function PropertyInfoSection({
  onNavigate,
}: PropertyInfoSectionProps) {
  const { t } = useTranslation();
  const wifiNetwork =
    import.meta.env.VITE_WIFI_NETWORK || t("propertyInfo.wifi.network");
  const wifiPassword =
    import.meta.env.VITE_WIFI_PASSWORD || t("propertyInfo.wifi.password");

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
        // On mobile (<=768px), nav is fixed at bottom, so no offset needed
        // On desktop, nav is sticky at top, so account for nav height
        const isMobile = window.innerWidth <= 768;
        const navHeight = isMobile ? 0 : (navigation?.getBoundingClientRect().height || 0);
        const elementPosition = checkoutSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div className="section-content">
      <h1>{t("propertyInfo.addressTitle")}</h1>

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
            {t("propertyInfo.checkInLabel")}
          </h3>
          <p className="highlight">{t("propertyInfo.checkIn")}</p>
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
            {t("propertyInfo.checkOutLabel")}
          </h3>
          <p className="highlight">{t("propertyInfo.checkOut")}</p>
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
          {t("propertyInfo.wifi.title")}
        </h3>
        <div className="wifi-details">
          <div className="wifi-item">
            <span className="label">{t("propertyInfo.wifi.networkLabel")}</span>
            <span className="value">{wifiNetwork}</span>
          </div>
          <div className="wifi-item">
            <span className="label">
              {t("propertyInfo.wifi.passwordLabel")}
            </span>
            <span className="value password">{wifiPassword}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

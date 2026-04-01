import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { GuideSection } from "./types/types";
import Navigation from "./components/Navigation";
import WelcomeSection from "./components/WelcomeSection";
import PropertyInfoSection from "./components/PropertyInfoSection";
import CheckInOutSection from "./components/CheckInOutSection";
import TransportSection from "./components/TransportSection";
import HouseRulesSection from "./components/HouseRulesSection";
import AmenitiesSection from "./components/AmenitiesSection";
import LocalGuideSection from "./components/LocalGuideSection";
import EmergencySection from "./components/EmergencySection";
import CodeEntryModal from "./components/CodeEntryModal";
import LanguageSelector from "./components/LanguageSelector";

const REQUIRED_CODE = import.meta.env.VITE_CODE || null;
const STORAGE_KEY = "guidebook-access-code";

function App() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("welcome");
  const [isChatButtonVisible, setIsChatButtonVisible] = useState(false);

  // Initialize code verification state from localStorage
  const [isCodeVerified, setIsCodeVerified] = useState(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY);
    return savedCode !== null && savedCode === REQUIRED_CODE;
  });

  const handleCodeVerified = () => {
    setIsCodeVerified(true);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const header = document.querySelector(".app-header");
    const navigation = document.querySelector(".navigation");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    
    const isMobile = window.innerWidth <= 768;
    const navHeight = isMobile ? 0 : (navigation?.getBoundingClientRect().height || 0);
    
    window.scrollTo({ top: headerHeight + navHeight, behavior: "smooth" });
  };

  const handleScrollToMenu = () => {
    const header = document.querySelector(".app-header");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    window.scrollTo({ top: headerHeight, behavior: "smooth" });
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // Show/hide chat button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrolledToTop = window.scrollY <= 100;
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;

      if ((scrolledToTop || scrolledToBottom) && isChatButtonVisible) {
        setIsChatButtonVisible(false);
      } else if (!scrolledToTop && !scrolledToBottom && !isChatButtonVisible) {
        setIsChatButtonVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isChatButtonVisible]);

  const apartmentNumber = import.meta.env.VITE_APARTMENT_NUMBER || "";
  const propertyName = t("propertyInfo.name");
  const propertyEmail = t("propertyInfo.email");
  const propertyPhone = t("propertyInfo.phone");
  const propertyPhoneLabel = t("propertyInfo.phoneLabel");
  const fullAddress = t("propertyInfo.address").replace(
    "{{APARTMENT_NUMBER}}",
    apartmentNumber,
  );

  const sections: GuideSection[] = [
    {
      id: "welcome",
      title: t("sections.welcome"),
      icon: "waving_hand",
      content: <WelcomeSection onNavigate={handleSectionChange} />,
    },
    {
      id: "property-info",
      title: t("sections.propertyInfo"),
      icon: "home",
      content: <PropertyInfoSection onNavigate={handleSectionChange} />,
    },
    {
      id: "check-in-out",
      title: t("sections.checkInOut"),
      icon: "key",
      content: <CheckInOutSection />,
    },
    {
      id: "transport",
      title: t("sections.transport"),
      icon: "directions_car",
      content: <TransportSection />,
    },
    {
      id: "house-rules",
      title: t("sections.houseRules"),
      icon: "rule",
      content: <HouseRulesSection />,
    },
    {
      id: "amenities",
      title: t("sections.amenities"),
      icon: "stars",
      content: <AmenitiesSection />,
    },
    {
      id: "local-guide",
      title: t("sections.localGuide"),
      icon: "map",
      content: <LocalGuideSection />,
    },
    {
      id: "emergency",
      title: t("sections.emergency"),
      icon: "emergency",
      content: <EmergencySection />,
    },
  ];

  const currentSection = sections.find((s) => s.id === activeSection);

  // Show code entry modal if not verified
  if (!isCodeVerified) {
    return (
      <CodeEntryModal
        onCodeVerified={handleCodeVerified}
        requiredCode={REQUIRED_CODE}
      />
    );
  }

  return (
    <div className="app">
      <LanguageSelector />

      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">{propertyName}</h1>
          <p className="app-address-mobile">
            <span className="material-symbols-outlined">location_on</span>
            {fullAddress}
          </p>
          <p className="app-subtitle">{t("common.everythingYouNeed")}</p>
          <span
            className="material-symbols-outlined chevron-down-icon"
            onClick={handleScrollToMenu}
          >
            expand_more
          </span>
        </div>
      </header>

      <Navigation
        sections={sections}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <main className="app-main">
        <div className="content-wrapper">{currentSection?.content}</div>
      </main>

      <footer className="app-footer">
        <p>
          {t("common.haveQuestions")}{" "}
          <a href={`mailto:${propertyEmail}`}>{propertyEmail}</a>
          <span className="space-mobile"> | </span>
          <a href={`tel:${propertyPhone}`}>{propertyPhoneLabel}</a>
        </p>
      </footer>

      {isChatButtonVisible && (
        <button onClick={handleChatClick} className="floating-chat-button">
          <span className="material-symbols-outlined">chat</span>
        </button>
      )}
    </div>
  );
}

export default App;

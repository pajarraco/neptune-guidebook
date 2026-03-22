import { useState } from "react";
import type { GuideSection } from "./types";
import Navigation from "./components/Navigation";
import PropertyInfoSection from "./components/PropertyInfoSection";
import CheckInOutSection from "./components/CheckInOutSection";
import TransportSection from "./components/TransportSection";
import HouseRulesSection from "./components/HouseRulesSection";
import AmenitiesSection from "./components/AmenitiesSection";
import LocalGuideSection from "./components/LocalGuideSection";
import EmergencySection from "./components/EmergencySection";
import CodeEntryModal from "./components/CodeEntryModal";
import guidebookDataRaw from "./assets/guidebook-data.json";
import type { GuidebookData } from "./types";

const guidebookData = guidebookDataRaw as GuidebookData;
import "./App.css";

const REQUIRED_CODE = import.meta.env.VITE_CODE || null;
const STORAGE_KEY = "guidebook-access-code";

function App() {
  const [activeSection, setActiveSection] = useState("property-info");

  // Initialize code verification state from localStorage
  const [isCodeVerified, setIsCodeVerified] = useState(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY);
    return savedCode !== null && savedCode === REQUIRED_CODE;
  });

  const handleCodeVerified = () => {
    setIsCodeVerified(true);
  };

  const { propertyInfo } = guidebookData;

  const sections: GuideSection[] = [
    {
      id: "property-info",
      title: "Property Info",
      icon: "home",
      content: <PropertyInfoSection info={propertyInfo} />,
    },
    {
      id: "check-in-out",
      title: "Check In/Out",
      icon: "key",
      content: <CheckInOutSection />,
    },
    {
      id: "transport",
      title: "Transport",
      icon: "directions_car",
      content: <TransportSection />,
    },
    {
      id: "house-rules",
      title: "House Rules",
      icon: "rule",
      content: <HouseRulesSection />,
    },
    {
      id: "amenities",
      title: "Amenities",
      icon: "stars",
      content: <AmenitiesSection />,
    },
    {
      id: "local-guide",
      title: "Local Guide",
      icon: "map",
      content: <LocalGuideSection />,
    },
    {
      id: "emergency",
      title: "Emergency",
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
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">{propertyInfo.name}</h1>
          <p className="app-subtitle">Everything you need for a great stay</p>
        </div>
      </header>

      <Navigation
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="app-main">
        <div className="content-wrapper">{currentSection?.content}</div>
      </main>

      <footer className="app-footer">
        <p>
          Have questions? Contact us anytime at{" "}
          <a href="mailto:host@example.com">host@example.com</a>
        </p>
      </footer>
    </div>
  );
}

export default App;

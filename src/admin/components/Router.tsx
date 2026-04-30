// Registry of section forms. The Editor uses this to render tabs and
// the active form component. Order here determines the tab order.
import type { ComponentType } from "react";
import WelcomeForm from "./sections/WelcomeForm";
import PropertyInfoForm from "./sections/PropertyInfoForm";
import CheckInOutForm from "./sections/CheckInOutForm";
import TransportForm from "./sections/TransportForm";
import HouseRulesForm from "./sections/HouseRulesForm";
import AmenitiesForm from "./sections/AmenitiesForm";
import LocalGuideForm from "./sections/LocalGuideForm";
import EmergencyForm from "./sections/EmergencyForm";
import MiscForm from "./sections/MiscForm";
import SettingsForm from "./settings/SettingsForm";

export interface SectionDef {
  id: string;
  label: string;
  Component: ComponentType;
}

export interface SettingsDef {
  id: string;
  label: string;
  Component: ComponentType;
}

export const SECTION_REGISTRY: SectionDef[] = [
  { id: "welcome", label: "Welcome", Component: WelcomeForm },
  { id: "propertyInfo", label: "Property Info", Component: PropertyInfoForm },
  { id: "checkInOut", label: "Check In/Out", Component: CheckInOutForm },
  { id: "transport", label: "Transport", Component: TransportForm },
  { id: "houseRules", label: "House Rules", Component: HouseRulesForm },
  { id: "amenities", label: "Amenities", Component: AmenitiesForm },
  { id: "localGuide", label: "Local Guide", Component: LocalGuideForm },
  { id: "emergency", label: "Emergency", Component: EmergencyForm },
  { id: "misc", label: "Nav & Common", Component: MiscForm },
];

export const SETTINGS_REGISTRY: SettingsDef[] = [
  { id: "settings", label: "Settings", Component: SettingsForm },
];

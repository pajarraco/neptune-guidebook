// Registry of section forms. The Editor uses this to render tabs and
// the active form component. Order here determines the tab order.
import type { ComponentType } from "react";
import WelcomeForm from "./WelcomeForm";
import PropertyInfoForm from "./PropertyInfoForm";
import CheckInOutForm from "./CheckInOutForm";
import TransportForm from "./TransportForm";
import HouseRulesForm from "./HouseRulesForm";
import AmenitiesForm from "./AmenitiesForm";
import LocalGuideForm from "./LocalGuideForm";
import EmergencyForm from "./EmergencyForm";
import MiscForm from "./MiscForm";

export interface SectionDef {
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

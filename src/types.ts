export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

export interface PropertyInfo {
  name: string;
  address: string;
  wifi: {
    network: string;
    password: string;
  };
  checkIn: string;
  checkOut: string;
  email: string;
  phone: string;
  phoneLabel: string;
}

export interface Amenity {
  name: string;
  description: string;
  instructions?: string;
  items?: string[];
  serviceInfo?: string;
}

export interface LocalRecommendation {
  category: string;
  name: string;
  description: string;
  address?: string;
  distance?: string;
  note?: string;
  link?: string;
}

export interface EmergencyContact {
  type: string;
  name: string;
  phone: string;
  address?: string;
  hours?: string;
  note?: string;
}

export interface CheckInOutStep {
  title: string;
  steps: string[];
  description?: string;
  arrivingEarly?: string;
  note?: string;
  personalMeet?: string;
  codeNotReceived?: string;
  time?: string;
  lateCheckout?: string;
}

export interface CheckInOut {
  checkIn: CheckInOutStep;
  checkOut: CheckInOutStep;
  tip?: string;
  directions?: {
    title: string;
    description: string;
  };
}

export interface TransportOption {
  name: string;
  phone?: string;
  type: string;
}

export interface Transport {
  parking?: {
    title: string;
    description: string;
  };
  rideshare?: {
    title: string;
    description: string;
  };
  publicTransport?: {
    title: string;
    description: string;
    info: string;
    fares: string;
    limitations?: string;
  };
  airportTransfers?: {
    title: string;
    description?: string;
    options: TransportOption[];
    note?: string;
  };
  carRental?: {
    title: string;
    description: string;
    note?: string;
  };
}

export interface LocalGuide {
  recommendations: LocalRecommendation[];
  tip?: string;
  packingList?: {
    title: string;
    items: string[];
  };
}

export interface Emergency {
  alert: {
    title: string;
    message: string;
  };
  contacts: EmergencyContact[];
  safetyInfo: {
    title: string;
    items: string[];
  };
  addressNote: string;
  waterSafety?: {
    title: string;
    beaches: string;
    freshwater: string;
  };
}

export interface HouseRule {
  icon: string;
  title: string;
  description: string;
}

export interface HouseRules {
  rules: HouseRule[];
  importantNote: {
    title: string;
    message: string;
  };
}

export interface GuidebookData {
  propertyInfo: PropertyInfo;
  checkInOut: CheckInOut;
  transport: Transport;
  houseRules: HouseRules;
  amenities: Amenity[];
  localGuide: LocalGuide;
  emergency: Emergency;
}

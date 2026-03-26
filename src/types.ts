export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

export interface Welcome {
  introMessages: string[];
  featuresSection: {
    title: string;
    answer: string;
    description: string;
    features: Array<{ icon: string; text: string; link?: string }>;
    note: string;
  };
  addToPhone: {
    icon: string;
    title: string;
    messages: string[];
  };
  meetYourTeam: {
    title: string;
    photoPlaceholder: string;
    hostWelcome: {
      icon: string;
      title: string;
      description: string;
      teamIntro: string;
      teamMembers: Array<{ icon: string; text: string }>;
    };
    founderNote: {
      icon: string;
      title: string;
      message: string;
      mission: string;
      closing: string;
    };
  };
}

export interface PropertyInfo {
  name: string;
  address: string;
  addressTitle: string;
  wifi: {
    network: string;
    password: string;
    title: string;
    networkLabel: string;
    passwordLabel: string;
  };
  checkIn: string;
  checkInLabel: string;
  checkOut: string;
  checkOutLabel: string;
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
  subheading?: string;
  steps: string[];
  description?: string;
  arrivingEarly?: string;
  arrivingEarlyLabel?: string;
  note?: string;
  personalMeet?: string;
  codeNotReceived?: string;
  time?: string;
  lateCheckout?: string;
}

export interface CheckInOut {
  sectionTitle: string;
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
  sectionTitle: string;
  faresLabel: string;
  pleaseNoteLabel: string;
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
  sectionTitle: string;
  viewOnMapsLabel: string;
  packingListIntro: string;
  recommendations: LocalRecommendation[];
  tip?: string;
  packingList?: {
    title: string;
    items: string[];
  };
}

export interface Emergency {
  sectionTitle: string;
  beachesLabel: string;
  freshwaterLabel: string;
  addressNoteLabel: string;
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

export interface AmenitiesSection {
  sectionTitle: string;
  serviceInfoLabel: string;
  howToUseLabel: string;
  helpTip: {
    title: string;
    message: string;
  };
}

export interface GuidebookData {
  welcome: Welcome;
  propertyInfo: PropertyInfo;
  checkInOut: CheckInOut;
  transport: Transport;
  houseRules: HouseRules;
  amenitiesSection: AmenitiesSection;
  amenities: Amenity[];
  localGuide: LocalGuide;
  emergency: Emergency;
}

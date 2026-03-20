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
}

export interface Amenity {
  name: string;
  description: string;
  instructions?: string;
}

export interface LocalRecommendation {
  category: string;
  name: string;
  description: string;
  address?: string;
  distance?: string;
}

export interface EmergencyContact {
  type: string;
  name: string;
  phone: string;
}

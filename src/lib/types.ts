export type DestinationCategory =
  | "Beaches"
  | "Marine & Wildlife"
  | "Culture & Heritage"
  | "Adventure & Water Sports"
  | "Eco & Nature";

export type TravelerType = "Solo" | "Couple" | "Family" | "Friends/Group";

export interface Destination {
  id: string;
  name: string;
  region: string;
  category: DestinationCategory;
  lat: number;
  lng: number;
  description: string;
  tags: string[];
  activities: string[];
  bestFor: TravelerType[];
  idealHours: number;
  sustainabilityNote: string;
}

export interface ItineraryRequest {
  days: number;
  interests: DestinationCategory[];
  travelerType: TravelerType;
  budget: "Budget" | "Mid-range" | "Premium";
  pace: "Relaxed" | "Balanced" | "Packed";
}

export interface ItineraryDay {
  day: number;
  title: string;
  destinationIds: string[];
  summary: string;
  tip: string;
}

export interface ItineraryResponse {
  overview: string;
  days: ItineraryDay[];
  source: "ai" | "fallback";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Destination {
  id: string;
  displayName?: {
    text: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  photos?: {
    name: string;
    widthPx?: number;
    heightPx?: number;
  }[];
  rating?: number;
  userRatingCount?: number;
  editorialSummary?: {
    text: string;
  };
  generativeSummary?: {
    text: string;
  };
  reviewSummary?: {
    text: string;
  };
  primaryTypeDisplayName?: {
    text: string;
  };
  types?: string[];
  googleMapsUri?: string;
  websiteUri?: string;
  googleMapsLinks?: {
    reviewsUri?: string;
  };
}

export type DestinationCategory = 'all' | 'mountains' | 'valleys' | 'lakes' | 'glaciers' | 'waterfalls' | 'caves';
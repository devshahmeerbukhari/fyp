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
    primaryTypeDisplayName?: {
        text: string;
    };
    types?: string[];
    googleMapsUri?: string;
    websiteUri?: string;
}

export type DestinationCategory = 'all' | 'mountains' | 'valleys' | 'lakes' | 'glaciers' | 'waterfalls' | 'caves';
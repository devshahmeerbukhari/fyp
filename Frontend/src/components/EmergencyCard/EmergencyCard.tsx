// Frontend/src/components/EmergencyCard/EmergencyCard.tsx
import React from 'react';
import { MapPin, Phone, Hospital, Shield, FireExtinguisher, Clock, Navigation, ExternalLink } from 'lucide-react';
import type{ Place } from '../../types/emergency.types';

interface EmergencyCardProps {
  place: Place;
  categoryId: string;
  getPhotoUrl: (place: Place) => string | null;
  isOpen: (place: Place) => boolean;
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({ 
  place, 
  categoryId, 
  getPhotoUrl,
  isOpen 
}) => {
  return (
    <div 
      key={place.id} 
      className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white"
    >
      {getPhotoUrl(place) ? (
        <div className="h-48 overflow-hidden">
          <img 
            src={getPhotoUrl(place) || ''} 
            alt={place.displayName?.text || 'Location'} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={`h-32 flex items-center justify-center 
          ${categoryId === 'hospital' ? 'bg-red-50' : 
            categoryId === 'police' ? 'bg-blue-50' : 
            categoryId === 'fire_station' ? 'bg-orange-50' : 'bg-green-50'}`}>
          <div className={`
            ${categoryId === 'hospital' ? 'text-red-600' : 
              categoryId === 'police' ? 'text-blue-600' : 
              categoryId === 'fire_station' ? 'text-orange-600' : 'text-green-600'}`}>
            {categoryId === 'hospital' || categoryId === 'pharmacy' ? (
              <Hospital className="h-16 w-16" strokeWidth={1.5} />
            ) : categoryId === 'police' ? (
              <Shield className="h-16 w-16" strokeWidth={1.5} />
            ) : (
              <FireExtinguisher className="h-16 w-16" strokeWidth={1.5} />
            )}
          </div>
        </div>
      )}
      
      <div className="p-5">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{place.displayName?.text || 'Unnamed Location'}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-gray-600 text-sm">{place.formattedAddress || 'No address available'}</p>
          </div>
          
          {place.internationalPhoneNumber && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-500 mr-2" />
              <a href={`tel:${place.internationalPhoneNumber}`} className="text-green-600 hover:underline text-sm">
                {place.internationalPhoneNumber}
              </a>
            </div>
          )}
          
          {place.currentOpeningHours && place.currentOpeningHours.weekdayDescriptions && 
          place.currentOpeningHours.weekdayDescriptions.length > 0 && (
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">
                {place.currentOpeningHours.weekdayDescriptions[0]}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
            ${isOpen(place) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isOpen(place) ? 'Open Now' : 'Closed'}
          </span>
          
          {place.primaryTypeDisplayName && (
            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-2.5 py-0.5 text-xs font-medium">
              {place.primaryTypeDisplayName.text}
            </span>
          )}
          
          {place.rating && (
            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-medium">
              ★ {place.rating} ({place.userRatingCount || 0})
            </span>
          )}
        </div>
        
        {place.location && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${place.location.latitude},${place.location.longitude}&query_place_id=${place.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
            <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};

export default EmergencyCard;
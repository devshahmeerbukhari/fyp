import React, { useState } from 'react';
import { MapPinned, Globe, Star, X, Info, ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Destination } from '../../types/destinations.types';
import { getDestinationPhotoUrl, getDestinationColor, getDestinationPhotoUrls } from '../../utils/destination.utils';

interface DestinationDetailProps {
  destination: Destination;
  onClose: () => void;
}

const DestinationDetail: React.FC<DestinationDetailProps> = ({ destination, onClose }) => {
  const [mediaType, setMediaType] = useState<'photo' | 'map'>('photo');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Get all available photo URLs (up to 3)
  const photoUrls = React.useMemo(() => 
    getDestinationPhotoUrls(destination, 3),
    [destination]
  );
  
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photoUrls.length);
  };
  
  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photoUrls.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{destination.displayName?.text}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        {/* Main content - scrollable */}
        <div className="overflow-y-auto flex-grow">
          {/* Media section - photo carousel or map */}
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            {mediaType === 'photo' ? (
              photoUrls.length > 0 ? (
                <div className="relative w-full h-full">
                  <img 
                    src={photoUrls[currentPhotoIndex]} 
                    alt={`${destination.displayName?.text || 'Destination'} - Photo ${currentPhotoIndex + 1}`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const placeName = destination.displayName?.text || 'Destination';
                      const color = getDestinationColor(destination.id);
                      e.currentTarget.src = `https://placehold.co/800x450/${color.substring(1)}/ffffff?text=${encodeURIComponent(placeName)}`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  
                  {/* Photo navigation controls */}
                  {photoUrls.length > 1 && (
                    <>
                      <button 
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      
                      {/* Photo indicator dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {photoUrls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                            aria-label={`Go to photo ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )
            ) : (
              <div className="w-full h-full">
                <iframe
                  title={`Map of ${destination.displayName?.text || 'destination'}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}&q=${encodeURIComponent(destination.formattedAddress || destination.displayName?.text || '')}`}
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {/* Media toggle buttons */}
            <div className="absolute bottom-4 right-4 bg-white shadow-lg rounded-full flex overflow-hidden">
              <button 
                className={`p-2 ${mediaType === 'photo' ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-gray-700'}`}
                onClick={() => setMediaType('photo')}
                aria-label="Show photo"
              >
                Photo
              </button>
              <button
                className={`p-2 ${mediaType === 'map' ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-gray-700'}`}
                onClick={() => setMediaType('map')}
                aria-label="Show map"
              >
                Map
              </button>
            </div>
          </div>
          
          {/* Details section */}
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="text-sm px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                {destination.primaryTypeDisplayName?.text || 'Natural Feature'}
              </div>
              {destination.rating && (
                <div className="flex items-center text-sm bg-amber-50 px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 mr-1.5 text-amber-500" fill="#f59e0b" />
                  <span className="font-medium">{destination.rating}</span>
                  <span className="text-gray-500 ml-1">({destination.userRatingCount || 0})</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mb-6">
              {destination.formattedAddress && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.formattedAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-gray-700 transition-colors"
                  aria-label="Open in Google Maps"
                >
                  <MapPinned className="h-7 w-7 flex-shrink-0 text-emerald-600" />
                </a>
              )}
              
              {destination.googleMapsUri && (
                <a
                  href={destination.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-gray-700 transition-colors"
                  aria-label="View on Google Maps"
                >
                  <Globe className="h-7 w-7 flex-shrink-0 text-blue-600" />
                </a>
              )}
              
              {destination.websiteUri && (
                <a
                  href={destination.websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-gray-700 transition-colors"
                  aria-label="Visit website"
                >
                  <ExternalLink className="h-7 w-7 flex-shrink-0 text-indigo-600" />
                </a>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
                <Info className="h-5 w-5 mr-2 text-emerald-600" />
                About this destination
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {destination.editorialSummary?.text || 
                  `Explore the natural beauty of ${destination.displayName?.text || 'this destination'} in Northern Pakistan. This region is known for its breathtaking landscapes and natural wonders.`}
              </p>
            </div>
            
            {/* Types/Tags */}
            {destination.types && destination.types.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {destination.types.map(type => (
                    <span 
                      key={type}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize"
                    >
                      {type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between">
            <button 
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            {destination.googleMapsUri && (
              <a
                href={destination.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center"
              >
                View on Google Maps
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
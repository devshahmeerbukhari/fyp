// Frontend/src/Pages/Emergency.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Hospital, Shield, FireExtinguisher } from 'lucide-react';
import type { Place, ApiResponse, EmergencyCategory } from '../types/emergency.types';
import EmergencyCard from '../components/EmergencyCard/EmergencyCard';

const Emergency = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [debug, setDebug] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');

  // Using colors that match the project's green-based scheme
  const emergencyCategories: EmergencyCategory[] = [
    { 
      id: 'hospital', 
      name: 'Hospitals', 
      icon: <Hospital className="h-10 w-10" strokeWidth={1.5} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverBg: 'hover:bg-red-100'
    },
    { 
      id: 'police', 
      name: 'Police Stations', 
      icon: <Shield className="h-10 w-10" strokeWidth={1.5} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100'
    },
    { 
      id: 'fire_station', 
      name: 'Fire Stations', 
      icon: <FireExtinguisher className="h-10 w-10" strokeWidth={1.5} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverBg: 'hover:bg-orange-100'
    },
    { 
      id: 'pharmacy', 
      name: 'Pharmacies', 
      icon: <Hospital className="h-10 w-10" strokeWidth={1.5} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverBg: 'hover:bg-green-100'
    }
  ];

  // Move isOpen function here, before it's used in the useMemo hook
  const isOpen = (place: Place): boolean => {
    if (!place.currentOpeningHours) return false;
    return place.currentOpeningHours.openNow || false;
  };

  // Now useMemo can use the isOpen function
  const filteredResults = useMemo(() => {
    if (statusFilter === 'all') return results;
    if (statusFilter === 'open') return results.filter(place => isOpen(place));
    return results.filter(place => !isOpen(place));
  }, [results, statusFilter]);

  useEffect(() => {
    if (selectedCategory) {
      fetchNearbyPlaces();
    }
  }, [selectedCategory]);

  const fetchNearbyPlaces = async (): Promise<void> => {
    setLoading(true);
    setError('');
    setDebug(null);
    
    try {
      // Get user location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
          
          try {
            const response = await fetch(`${backendUrl}/api/v1/emergency/nearby`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                latitude,
                longitude,
                type: selectedCategory,
                radius: 10000 // 10km in meters
              }),
            });
            
            let data: ApiResponse;
            try {
              data = await response.json();
              setDebug(data);
            } catch (jsonError) {
              throw new Error('Invalid response from server');
            }
            
            if (!response.ok) {
              const errorMessage = data?.message || `Server returned ${response.status}`;
              throw new Error(errorMessage);
            }
            
            // Handle standardized API response
            if (!data.success || !Array.isArray(data.data)) {
              throw new Error('Invalid response format from server');
            }
            
            setResults(data.data);
          } catch (fetchError: any) {
            setDebug({ error: fetchError.message });
            throw fetchError;
          }
        },
        (geoError) => {
          setDebug({ geoError: geoError.message, code: geoError.code });
          setError('Please enable location access to find nearby emergency services');
        }
      );
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching nearby places');
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = (place: Place): string | null => {
    if (place.photos && place.photos.length > 0) {
      const photoReference = place.photos[0].name;
      return `https://places.googleapis.com/v1/${photoReference}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}&maxHeightPx=400`;
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Emergency Help</h1>
        <p className="text-gray-600 max-w-xl mx-auto">Find nearby emergency services based on your current location</p>
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Emergency Service</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {emergencyCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group relative flex flex-col items-center rounded-xl overflow-hidden transition-all duration-300 
                ${selectedCategory === category.id 
                  ? `${category.color} ${category.bgColor} shadow-lg border-2 border-${category.color.replace('text-', '')}/50 transform scale-[1.02]` 
                  : 'bg-white border border-gray-100 hover:shadow-md'}`}
            >
              {/* Glass effect top accent */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 ${category.color.replace('text-', 'bg-')}/70`} 
              />
              
              <div className="p-6 flex flex-col items-center w-full">
                {/* Icon with animated background */}
                <div 
                  className={`relative flex items-center justify-center w-16 h-16 mb-4 rounded-full 
                    ${selectedCategory === category.id 
                      ? `${category.bgColor} ${category.color}` 
                      : `bg-gray-50 ${category.color}`}
                    transition-all duration-300 group-hover:${category.bgColor}`}
                >
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`absolute inset-0 rounded-full ${category.color.replace('text-', 'bg-')}/10 animate-pulse`}></div>
                  </div>
                  {category.icon}
                </div>
                
                {/* Category name */}
                <h3 className={`font-medium text-center transition-colors duration-300
                  ${selectedCategory === category.id 
                    ? category.color
                    : 'text-gray-800 group-hover:' + category.color}`}
                >
                  {category.name}
                </h3>
                
                {/* Info text */}
                <p className={`mt-2 text-xs text-gray-500 text-center transition-opacity duration-300 
                  ${selectedCategory === category.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-80'}`}>
                  Find nearby {category.name.toLowerCase()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter options */}
      {selectedCategory && results.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Filter Results</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${statusFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('open')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${statusFilter === 'open' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Open Now
            </button>
            <button 
              onClick={() => setStatusFilter('closed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${statusFilter === 'closed' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Closed
            </button>
          </div>
        </div>
      )}

      {/* Results section */}
      {selectedCategory && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {loading ? 'Searching...' : (
              results.length 
                ? `Nearby ${emergencyCategories.find(c => c.id === selectedCategory)?.name || 'Places'}` 
                : error 
                  ? 'Error' 
                  : 'No Results'
            )}
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
              <button 
                onClick={fetchNearbyPlaces}
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
                  </div>
          ) : filteredResults.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg text-center">
              <p className="mb-2">No {statusFilter !== 'all' ? `${statusFilter} ` : ''}results found for this category in your area.</p>
              {statusFilter !== 'all' && (
                <button 
                  onClick={() => setStatusFilter('all')}
                  className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  Show All Results Instead
                </button>
                  )}
                </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map(place => (
                <EmergencyCard
                  key={place.id}
                  place={place}
                  categoryId={selectedCategory}
                  getPhotoUrl={getPhotoUrl}
                  isOpen={isOpen}
                />
            ))}
          </div>
          )}
        </div>
      )}

      {!selectedCategory && (
        <div className="text-center py-12 text-gray-500">
          <p>Please select an emergency service category above to find nearby locations</p>
        </div>
      )}
    </div>
  );
};

export default Emergency;
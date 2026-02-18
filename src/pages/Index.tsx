"use client";

import React, { useState } from 'react';
import TransportMap from '@/components/TransportMap';
import SearchPanel from '@/components/SearchPanel';
import SuggestedRoutes from '@/components/SuggestedRoutes';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { MapPin, Navigation, Layers } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const CASABLANCA_CENTER: [number, number] = [33.5731, -7.5898];

// Mock coordinates for Casablanca locations
const LOCATIONS: Record<string, [number, number]> = {
  "Maarif": [33.5819, -7.6324],
  "Sidi Moumen": [33.5867, -7.5317],
  "Casa Voyageurs": [33.5892, -7.5975],
  "Morocco Mall": [33.5883, -7.7058],
  "Technopark": [33.5415, -7.6345]
};

const Index = () => {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(CASABLANCA_CENTER);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (from: string, to: string) => {
    // Simulate finding coordinates for the search terms
    // In a real app, this would use a Geocoding API
    const fromCoord = LOCATIONS[from] || [33.58, -7.60];
    const toCoord = LOCATIONS[to] || [33.59, -7.55];
    
    setOrigin(fromCoord);
    setDestination(toCoord);
    setMapCenter(fromCoord);
    setIsSearching(true);
    showSuccess("Itinéraire calculé");
  };

  const handleSelectCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
          setOrigin(loc);
          setMapCenter(loc);
          showSuccess("Position actuelle sélectionnée comme départ");
        },
        (error) => {
          showError("Impossible d'accéder à votre position");
        }
      );
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50 font-sans">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <TransportMap center={mapCenter} origin={origin} destination={destination} />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col md:flex-row p-4 md:p-6 gap-6">
        {/* Left Sidebar / Panel */}
        <div className="w-full md:w-[400px] pointer-events-auto flex flex-col h-full max-h-[90vh] md:max-h-full">
          <div className="flex-shrink-0">
            <SearchPanel 
              onSearch={handleSearch} 
              onSelectCurrentLocation={handleSelectCurrentLocation}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto mt-2 no-scrollbar pb-20">
            <SuggestedRoutes isVisible={isSearching} />
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-10 right-6 flex flex-col gap-3 pointer-events-auto">
          <button 
            className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all active:scale-95 border border-gray-100"
            title="Changer de vue"
          >
            <Layers size={20} />
          </button>
          <button 
            onClick={() => origin && setMapCenter(origin)}
            className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 border border-gray-100"
            title="Centrer sur le départ"
          >
            <Navigation size={20} />
          </button>
        </div>
      </div>

      {/* Branding Footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black text-gray-800 uppercase tracking-[0.3em]">Casablanca Transport</span>
        </div>
      </div>
      
      <div className="hidden">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
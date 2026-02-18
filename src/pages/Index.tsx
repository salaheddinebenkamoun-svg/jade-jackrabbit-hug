"use client";

import React, { useState, useEffect } from 'react';
import TransportMap from '@/components/TransportMap';
import SearchPanel from '@/components/SearchPanel';
import SuggestedRoutes from '@/components/SuggestedRoutes';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { MapPin, Navigation } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const CASABLANCA_CENTER: [number, number] = [33.5731, -7.5898];

const Index = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(CASABLANCA_CENTER);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
          showSuccess("Position détectée avec succès");
        },
        (error) => {
          console.error("Error getting location:", error);
          showError("Impossible d'accéder à votre position");
        }
      );
    }
  }, []);

  const handleSearch = (from: string, to: string) => {
    // Logic for searching routes would go here
    console.log(`Searching from ${from} to ${to}`);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50 font-sans">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <TransportMap center={mapCenter} userLocation={userLocation} />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col md:flex-row p-4 md:p-6 gap-6">
        {/* Left Sidebar / Panel */}
        <div className="w-full md:w-[400px] pointer-events-auto flex flex-col h-full max-h-[90vh] md:max-h-full">
          <div className="flex-shrink-0">
            <SearchPanel onSearch={handleSearch} />
          </div>
          
          <div className="flex-1 overflow-y-auto mt-4 no-scrollbar">
            <SuggestedRoutes />
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-3 pointer-events-auto">
          <button 
            onClick={() => userLocation && setMapCenter(userLocation)}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95"
          >
            <Navigation size={24} />
          </button>
          <button 
            className="w-12 h-12 bg-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-emerald-700 transition-all active:scale-95"
          >
            <MapPin size={24} />
          </button>
        </div>
      </div>

      {/* Branding Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-md px-4 py-1 rounded-full shadow-sm border border-white/20">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Casablanca Transport Network</span>
        </div>
      </div>
      
      <div className="hidden">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
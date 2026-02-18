"use client";

import React, { useState } from 'react';
import TransportMap from '@/components/TransportMap';
import SearchPanel from '@/components/SearchPanel';
import SuggestedRoutes from '@/components/SuggestedRoutes';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Navigation, Layers, LocateFixed } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const CASABLANCA_CENTER: [number, number] = [33.5731, -7.5898];

const Index = () => {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(CASABLANCA_CENTER);
  const [selectedRoutePath, setSelectedRoutePath] = useState<[number, number][] | null>(null);

  const handleMapClick = (latlng: [number, number]) => {
    if (!origin) {
      setOrigin(latlng);
      showSuccess("Départ sélectionné");
    } else if (!destination) {
      setDestination(latlng);
      showSuccess("Itinéraire calculé");
    }
  };

  const handleSelectLocation = (type: 'origin' | 'destination', latlng: [number, number], name: string) => {
    if (type === 'origin') {
      setOrigin(latlng);
      setMapCenter(latlng);
    } else {
      setDestination(latlng);
    }
    setSelectedRoutePath(null);
    showSuccess(`${type === 'origin' ? 'Départ' : 'Arrivée'} : ${name.split(',')[0]}`);
  };

  const handleSelectRoute = (path: [number, number][] | null) => {
    if (path) {
      setSelectedRoutePath(path);
    } else if (origin && destination) {
      setSelectedRoutePath([origin, destination]);
    }
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setSelectedRoutePath(null);
    setMapCenter(CASABLANCA_CENTER);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#28a745] font-sans">
      {/* Map Background */}
      <div className="absolute inset-0 z-0 opacity-90">
        <TransportMap 
          center={mapCenter} 
          origin={origin} 
          destination={destination} 
          selectedRoutePath={selectedRoutePath}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col p-4 md:p-8 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md mx-auto space-y-4">
          <SearchPanel 
            origin={origin}
            destination={destination}
            onSelectLocation={handleSelectLocation}
            onReset={handleReset}
          />
          
          <SuggestedRoutes 
            isVisible={!!(origin && destination)} 
            onSelectRoute={handleSelectRoute}
            selectedId={null}
          />
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-4 pointer-events-auto">
          <button 
            onClick={() => origin && setMapCenter(origin)}
            className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#28a745] hover:scale-110 transition-all active:scale-95 border-4 border-white"
          >
            <LocateFixed size={28} />
          </button>
        </div>
      </div>

      {/* Branding Footer */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">CasaWay • Citymapper Style</span>
        </div>
      </div>
      
      <div className="hidden">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
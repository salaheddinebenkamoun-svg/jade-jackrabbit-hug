"use client";

import React, { useState } from 'react';
import TransportMap from '@/components/TransportMap';
import SearchPanel from '@/components/SearchPanel';
import SuggestedRoutes from '@/components/SuggestedRoutes';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Navigation, Layers } from 'lucide-react';
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
    setSelectedRoutePath(null); // Reset path when location changes
    showSuccess(`${type === 'origin' ? 'Départ' : 'Arrivée'} : ${name.split(',')[0]}`);
  };

  const handleSelectRoute = (path: [number, number][] | null) => {
    if (path) {
      setSelectedRoutePath(path);
    } else if (origin && destination) {
      // Fallback to straight line if no specific path
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
    <div className="relative h-screen w-full overflow-hidden bg-gray-50 font-sans">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <TransportMap 
          center={mapCenter} 
          origin={origin} 
          destination={destination} 
          selectedRoutePath={selectedRoutePath}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col md:flex-row p-4 md:p-6 gap-6">
        {/* Left Sidebar / Panel */}
        <div className="w-full md:w-[400px] pointer-events-auto flex flex-col h-full max-h-[90vh] md:max-h-full">
          <div className="flex-shrink-0">
            <SearchPanel 
              origin={origin}
              destination={destination}
              onSelectLocation={handleSelectLocation}
              onReset={handleReset}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto mt-2 no-scrollbar pb-20">
            <SuggestedRoutes 
              isVisible={!!(origin && destination)} 
              onSelectRoute={handleSelectRoute}
              selectedId={null} // On pourrait ajouter un état pour l'ID sélectionné
            />
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
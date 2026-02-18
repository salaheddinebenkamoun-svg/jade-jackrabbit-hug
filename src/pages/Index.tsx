"use client";

import React, { useState, useEffect } from 'react';
import TransportMap from '@/components/TransportMap';
import SearchPanel from '@/components/SearchPanel';
import ModeSelector from '@/components/ModeSelector';
import SuggestedRoutes from '@/components/SuggestedRoutes';
import { getRealRoute } from '@/utils/routing';
import { showSuccess } from '@/utils/toast';

const CASABLANCA_CENTER: [number, number] = [33.5731, -7.5898];

const Index = () => {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [selectedMode, setSelectedMode] = useState<'foot' | 'bike' | 'car'>('car');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][] | null>(null);
  const [modeStats, setModeStats] = useState({
    foot: { duration: 32, extra: '131 cal' },
    bike: { duration: 17, extra: '71 cal' },
    car: { duration: 13, extra: 'Cab' }
  });

  const updateRealRoute = async (start: [number, number], end: [number, number], mode: 'foot' | 'bike' | 'car') => {
    const result = await getRealRoute(start, end, mode);
    setRoutePath(result.path);
    
    // Update stats for all modes to show in selector
    const foot = await getRealRoute(start, end, 'foot');
    const bike = await getRealRoute(start, end, 'bike');
    const car = await getRealRoute(start, end, 'car');
    
    setModeStats({
      foot: { duration: foot.duration, extra: `${Math.round(foot.duration * 4.1)} cal` },
      bike: { duration: bike.duration, extra: `${Math.round(bike.duration * 4.2)} cal` },
      car: { duration: car.duration, extra: 'Cab' }
    });
  };

  useEffect(() => {
    if (origin && destination) {
      updateRealRoute(origin, destination, selectedMode);
    }
  }, [origin, destination, selectedMode]);

  const handleMapClick = (latlng: [number, number]) => {
    if (!origin) {
      setOrigin(latlng);
      setOriginName(`${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}`);
    } else if (!destination) {
      setDestination(latlng);
      setDestinationName(`${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}`);
      showSuccess("Itinéraire calculé sur les rues réelles");
    }
  };

  const handleSelectLocation = (type: 'origin' | 'destination', latlng: [number, number], name: string) => {
    if (type === 'origin') {
      setOrigin(latlng);
      setOriginName(name.split(',')[0]);
    } else {
      setDestination(latlng);
      setDestinationName(name.split(',')[0]);
    }
    setSelectedRouteId(null);
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setOriginName('');
    setDestinationName('');
    setRoutePath(null);
    setSelectedRouteId(null);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50 font-sans">
      <div className="absolute inset-0 z-0">
        <TransportMap 
          center={CASABLANCA_CENTER} 
          origin={origin} 
          destination={destination} 
          selectedRoutePath={routePath}
          onMapClick={handleMapClick}
        />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
        <SearchPanel 
          originName={originName}
          destinationName={destinationName}
          onSelectLocation={handleSelectLocation}
          onReset={handleReset}
        />

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 no-scrollbar">
          <div className="max-w-md mx-auto space-y-4">
            {origin && destination && (
              <ModeSelector 
                selectedMode={selectedMode}
                onSelect={setSelectedMode}
                options={[
                  { id: 'foot', label: 'Walk', icon: null, ...modeStats.foot },
                  { id: 'bike', label: 'Cycle', icon: null, ...modeStats.bike },
                  { id: 'car', label: 'Cab', icon: null, ...modeStats.car }
                ]}
              />
            )}

            <SuggestedRoutes 
              isVisible={!!(origin && destination)}
              selectedId={selectedRouteId}
              onSelect={(id) => {
                setSelectedRouteId(id);
                // In a real app, we'd fetch the specific GTFS path here
                showSuccess(`Ligne ${id.toUpperCase()} sélectionnée`);
              }}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black text-gray-800 uppercase tracking-[0.3em]">CasaWay Live</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
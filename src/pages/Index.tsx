"use client";

import React, { useState, useEffect } from 'react';
import TransportMap from '@/components/TransportMap';
import SearchPanel from '@/components/SearchPanel';
import SuggestedRoutes from '@/components/SuggestedRoutes';
import { getRealRoute } from '@/utils/routing';
import { showSuccess } from '@/utils/toast';

const CASABLANCA_CENTER: [number, number] = [33.5731, -7.5898];

const Index = () => {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][] | null>(null);
  const [pathColor, setPathColor] = useState("#10b981");
  const [modeStats, setModeStats] = useState({
    foot: { duration: 0 },
    bike: { duration: 0 },
    car: { duration: 0 }
  });

  // Update base stats when origin/destination changes
  useEffect(() => {
    const updateStats = async () => {
      if (origin && destination) {
        const [foot, bike, car] = await Promise.all([
          getRealRoute(origin, destination, 'foot'),
          getRealRoute(origin, destination, 'bike'),
          getRealRoute(origin, destination, 'car')
        ]);
        
        setModeStats({
          foot: { duration: foot.duration },
          bike: { duration: bike.duration },
          car: { duration: car.duration }
        });

        // Default to car path on first load
        if (!selectedRouteId) {
          setRoutePath(car.path);
          setPathColor("#ef4444");
          setSelectedRouteId('car');
        }
      }
    };
    updateStats();
  }, [origin, destination]);

  const handleMapClick = (latlng: [number, number]) => {
    if (!origin) {
      setOrigin(latlng);
      setOriginName(`${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}`);
    } else if (!destination) {
      setDestination(latlng);
      setDestinationName(`${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}`);
      showSuccess("Destination définie");
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
    setRoutePath(null);
  };

  const handleSwap = () => {
    const tempOrigin = origin;
    const tempOriginName = originName;
    setOrigin(destination);
    setOriginName(destinationName);
    setDestination(tempOrigin);
    setDestinationName(tempOriginName);
    setSelectedRouteId(null);
    setRoutePath(null);
    showSuccess("Itinéraire inversé");
  };

  const handleSelectOption = async (id: string, color: string, routingMode: 'foot' | 'bike' | 'car' | 'public') => {
    if (!origin || !destination) return;
    
    setSelectedRouteId(id);
    setPathColor(color);
    
    const result = await getRealRoute(origin, destination, routingMode);
    setRoutePath(result.path);
    showSuccess(`${id.toUpperCase()} sélectionné`);
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
    <div className="relative h-screen w-full overflow-hidden bg-gray-50 font-sans flex">
      {/* Left Sidebar */}
      <div className="w-full md:w-[400px] h-full bg-white shadow-2xl z-20 flex flex-col border-r border-gray-100">
        <SearchPanel 
          originName={originName}
          destinationName={destinationName}
          onSelectLocation={handleSelectLocation}
          onSwap={handleSwap}
          onReset={handleReset}
        />

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <SuggestedRoutes 
            isVisible={!!(origin && destination)}
            selectedId={selectedRouteId}
            onSelect={handleSelectOption}
            modeStats={modeStats}
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative z-10">
        <TransportMap 
          center={CASABLANCA_CENTER} 
          origin={origin} 
          destination={destination} 
          selectedRoutePath={routePath}
          pathColor={pathColor}
          onMapClick={handleMapClick}
        />

        {/* Floating Branding */}
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black text-gray-800 uppercase tracking-[0.3em]">CasaWay Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
"use client";

import React, { useState, useEffect } from 'react';
import TransportMap from '@/components/TransportMap';
import SearchPanel from '@/components/SearchPanel';
import SuggestedRoutes, { type RoutingMode } from '@/components/SuggestedRoutes';
import { getRealRoute, getRouteByOption } from '@/utils/routing';
import { getPublicOptionMetrics } from '@/utils/transitRouting';
import { showSuccess } from '@/utils/toast';

const CASABLANCA_CENTER: [number, number] = [33.5731, -7.5898];

interface OptionMetric {
  duration: number;
  distance: number;
  feasible?: boolean;
  summary?: string;
  accessDistanceKm?: number;
}

const EMPTY_METRIC: OptionMetric = { duration: 0, distance: 0 };

const Index = () => {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][] | null>(null);
  const [previewPath, setPreviewPath] = useState<[number, number][] | null>(null);
  const [pathColor, setPathColor] = useState('#10b981');
  const [selectedMode, setSelectedMode] = useState<RoutingMode | null>(null);
  const [optionStats, setOptionStats] = useState<Record<string, OptionMetric>>({
    foot: EMPTY_METRIC,
    bike: EMPTY_METRIC,
    taxi: EMPTY_METRIC,
  });
  const [recommendation, setRecommendation] = useState('Sélectionnez deux points pour obtenir une recommandation réelle sur le réseau Casa Tramway / Busway / Bus.');

  useEffect(() => {
    const updateStats = async () => {
      if (!origin || !destination) {
        return;
      }

      const [foot, bike, taxi] = await Promise.all([
        getRealRoute(origin, destination, 'foot'),
        getRealRoute(origin, destination, 'bike'),
        getRealRoute(origin, destination, 'taxi'),
      ]);

      const publicMetrics = getPublicOptionMetrics(origin, destination);
      const merged: Record<string, OptionMetric> = {
        foot: { duration: foot.duration, distance: foot.distance },
        bike: { duration: bike.duration, distance: bike.distance },
        taxi: { duration: taxi.duration, distance: taxi.distance },
        ...publicMetrics,
      };

      setOptionStats(merged);
      setPreviewPath(taxi.path);

      const fastestPublic = Object.entries(publicMetrics)
        .filter(([, value]) => value.feasible)
        .sort((a, b) => a[1].duration - b[1].duration)[0];

      if (!fastestPublic) {
        setRecommendation(`Distance estimée: ${taxi.distance} km. Option la plus réaliste: taxi (${taxi.duration} min), car les lignes structurantes sont loin de vos deux points.`);
        return;
      }

      const [lineId, lineMetric] = fastestPublic;
      const lineChoice = lineMetric.summary?.split(':')[0] || lineId.toUpperCase();
      setRecommendation(`Distance estimée: ${lineMetric.distance} km. Meilleur choix réseau: ${lineChoice} (~${lineMetric.duration} min), avec correspondance marche d'environ ${lineMetric.accessDistanceKm ?? 0} km.`);
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
      showSuccess('Destination définie');
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
    setPreviewPath(null);
    setSelectedMode(null);
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
    setPreviewPath(null);
    setSelectedMode(null);
    showSuccess('Itinéraire inversé');
  };

  const handleSelectOption = async (id: string, color: string, routingMode: RoutingMode) => {
    if (!origin || !destination) return;

    setSelectedRouteId(id);
    setPathColor(color);
    setSelectedMode(routingMode);

    const result = await getRouteByOption(origin, destination, id, routingMode);
    setRoutePath(result.path);
    showSuccess(`${id.toUpperCase()} sélectionné`);
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setOriginName('');
    setDestinationName('');
    setRoutePath(null);
    setPreviewPath(null);
    setSelectedRouteId(null);
    setSelectedMode(null);
    setRecommendation('Sélectionnez deux points pour obtenir une recommandation réelle sur le réseau Casa Tramway / Busway / Bus.');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50 font-sans flex">
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
            optionStats={optionStats}
            recommendation={recommendation}
          />
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <TransportMap
          center={CASABLANCA_CENTER}
          origin={origin}
          destination={destination}
          selectedRoutePath={routePath}
          previewPath={previewPath}
          pathColor={pathColor}
          selectedMode={selectedMode}
          onMapClick={handleMapClick}
        />

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

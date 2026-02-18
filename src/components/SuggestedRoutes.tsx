"use client";

import React from 'react';
import { Clock, Train, Bus, Zap, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simulation de données réelles basées sur le réseau Casa Tramway/Busway
const MOCK_ROUTES = [
  {
    id: 't1',
    type: 'Tramway',
    line: 'T1',
    color: 'bg-emerald-600',
    hex: '#059669',
    duration: '28 min',
    arrival: '15:12',
    price: '6 MAD',
    path: [
      [33.5867, -7.5317], // Sidi Moumen
      [33.5892, -7.5975], // Casa Voyageurs
      [33.5951, -7.6153], // Place Nations Unies
      [33.5819, -7.6324], // Abdelmoumen
      [33.5415, -7.6345]  // Lissasfa
    ],
    steps: ['Marche 4 min', 'T1 (Direction Lissasfa)', 'Marche 2 min']
  },
  {
    id: 'bw1',
    type: 'Busway',
    line: 'BW1',
    color: 'bg-blue-600',
    hex: '#2563eb',
    duration: '35 min',
    arrival: '15:19',
    price: '6 MAD',
    path: [
      [33.5512, -7.5621], // Salmia
      [33.5623, -7.5912], // Bd Mohammed VI
      [33.5711, -7.6234], // Bd Ghandi
      [33.5883, -7.7058]  // Laymoun
    ],
    steps: ['Marche 6 min', 'BW1 (Direction Laymoun)', 'Marche 5 min']
  },
  {
    id: 'bus',
    type: 'Bus',
    line: 'L97',
    color: 'bg-orange-500',
    hex: '#f97316',
    duration: '42 min',
    arrival: '15:26',
    price: '5 MAD',
    path: null, // Le bus suit souvent le trajet direct pour la démo
    steps: ['Marche 2 min', 'Bus 97 (Alsa)', 'Marche 8 min']
  }
];

interface SuggestedRoutesProps {
  isVisible: boolean;
  onSelectRoute: (path: [number, number][] | null) => void;
  selectedId: string | null;
}

const SuggestedRoutes = ({ isVisible, onSelectRoute, selectedId }: SuggestedRoutesProps) => {
  if (!isVisible) {
    return (
      <div className="mt-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
          <Info size={20} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">Entrez votre trajet pour voir les options de transport (Tram, Busway, Bus)</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Options de trajet</h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Temps réel</span>
      </div>
      
      <div className="space-y-3">
        {MOCK_ROUTES.map((route) => (
          <div 
            key={route.id}
            onClick={() => onSelectRoute(route.path)}
            className={cn(
              "bg-white p-4 rounded-2xl border transition-all cursor-pointer group active:scale-[0.99]",
              selectedId === route.id ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg" : "border-gray-100 shadow-sm hover:shadow-md"
            )}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm", route.color)}>
                  {route.type === 'Tramway' && <Train size={20} />}
                  {route.type === 'Busway' && <Zap size={20} />}
                  {route.type === 'Bus' && <Bus size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{route.line}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm font-bold text-gray-700">{route.duration}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                    <Clock size={10} />
                    Arrivée à {route.arrival}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-emerald-600">{route.price}</div>
                <ChevronRight size={16} className={cn("transition-colors ml-auto mt-1", selectedId === route.id ? "text-emerald-500" : "text-gray-300")} />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 overflow-hidden">
              {route.steps.map((step, i) => (
                <React.Fragment key={i}>
                  <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                    {step}
                  </span>
                  {i < route.steps.length - 1 && (
                    <div className="w-1 h-1 rounded-full bg-gray-200 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedRoutes;
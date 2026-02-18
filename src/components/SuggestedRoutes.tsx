"use client";

import React from 'react';
import { Clock, Train, Bus, Zap, ChevronRight, Info, Footprints, Bike, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_ROUTES = [
  {
    id: 'walk',
    type: 'Walk',
    icon: Footprints,
    color: 'text-gray-400',
    bg: 'bg-white',
    duration: '32',
    info: '131 cal',
    infoColor: 'text-[#28a745]',
    path: null
  },
  {
    id: 'cycle',
    type: 'Cycle',
    icon: Bike,
    color: 'text-gray-400',
    bg: 'bg-white',
    duration: '17',
    info: '71 cal',
    infoColor: 'text-[#28a745]',
    path: null
  },
  {
    id: 'cab',
    type: 'Cab',
    icon: Car,
    color: 'text-gray-400',
    bg: 'bg-white',
    duration: '13',
    info: '',
    infoColor: '',
    path: null
  }
];

const TRANSPORT_ROUTES = [
  {
    id: 't1',
    type: 'Tramway',
    line: 'T1',
    color: 'bg-[#00d66b]',
    duration: '28 min',
    arrival: '15:12',
    price: '6 MAD',
    path: [
      [33.5867, -7.5317], [33.5892, -7.5975], [33.5951, -7.6153], [33.5819, -7.6324], [33.5415, -7.6345]
    ],
    steps: ['Walk 4 min', 'T1 (Lissasfa)', 'Walk 2 min']
  },
  {
    id: 'bw1',
    type: 'Busway',
    line: 'BW1',
    color: 'bg-[#007bff]',
    duration: '35 min',
    arrival: '15:19',
    price: '6 MAD',
    path: [
      [33.5512, -7.5621], [33.5623, -7.5912], [33.5711, -7.6234], [33.5883, -7.7058]
    ],
    steps: ['Walk 6 min', 'BW1 (Laymoun)', 'Walk 5 min']
  }
];

interface SuggestedRoutesProps {
  isVisible: boolean;
  onSelectRoute: (path: [number, number][] | null) => void;
  selectedId: string | null;
}

const SuggestedRoutes = ({ isVisible, onSelectRoute, selectedId }: SuggestedRoutesProps) => {
  if (!isVisible) return null;

  return (
    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pointer-events-auto">
      {/* Quick Options Grid (Walk, Cycle, Cab) */}
      <div className="grid grid-cols-3 gap-0.5 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
        {MOCK_ROUTES.map((route) => (
          <div 
            key={route.id}
            className="bg-white p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <route.icon size={24} className={route.color} />
            <div className="mt-1">
              <span className="text-xl font-black text-gray-800">{route.duration}</span>
              <span className="text-[10px] font-bold text-gray-400 ml-0.5">min</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{route.type}</span>
              {route.info && <span className={cn("text-[10px] font-bold", route.infoColor)}>{route.info}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Transport Options */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] px-1">Public Transport</h3>
        {TRANSPORT_ROUTES.map((route) => (
          <div 
            key={route.id}
            onClick={() => onSelectRoute(route.path)}
            className={cn(
              "bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-lg active:scale-[0.98]",
              selectedId === route.id ? "ring-4 ring-white/20" : "hover:shadow-xl"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner font-black text-lg", route.color)}>
                  {route.line}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-gray-800">{route.duration}</span>
                    <span className="text-xs font-bold text-gray-400">Arrive {route.arrival}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {route.steps.map((step, i) => (
                      <React.Fragment key={i}>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                          {step}
                        </span>
                        {i < route.steps.length - 1 && <ChevronRight size={10} className="text-gray-300" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-[#28a745]">{route.price}</div>
                <ChevronRight size={20} className="text-gray-200 ml-auto mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white font-bold text-sm hover:bg-white/30 transition-all">
        Try a different time?
      </button>
    </div>
  );
};

export default SuggestedRoutes;
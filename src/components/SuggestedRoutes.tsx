"use client";

import React from 'react';
import { Clock, Train, Bus, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const routes = [
  {
    id: 1,
    type: 'Tramway',
    line: 'T1',
    color: 'bg-emerald-600',
    duration: '24 min',
    arrival: '14:42',
    price: '6 MAD',
    steps: ['Marche 5 min', 'T1 (Sidi Moumen)', 'Marche 2 min']
  },
  {
    id: 2,
    type: 'Busway',
    line: 'BW1',
    color: 'bg-blue-600',
    duration: '32 min',
    arrival: '14:50',
    price: '6 MAD',
    steps: ['Marche 3 min', 'BW1 (Laymoun)', 'Marche 8 min']
  },
  {
    id: 3,
    type: 'Bus',
    line: 'L97',
    color: 'bg-orange-500',
    duration: '45 min',
    arrival: '15:03',
    price: '5 MAD',
    steps: ['Marche 2 min', 'Bus 97', 'Marche 5 min']
  }
];

const SuggestedRoutes = () => {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Points Suggérés</h3>
      
      <div className="space-y-3">
        {routes.map((route) => (
          <div 
            key={route.id}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", route.color)}>
                  {route.type === 'Tramway' && <Train size={20} />}
                  {route.type === 'Busway' && <Zap size={20} />}
                  {route.type === 'Bus' && <Bus size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{route.line}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm font-medium text-gray-600">{route.duration}</span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock size={12} />
                    Arrivée à {route.arrival}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-600">{route.price}</div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors ml-auto mt-1" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 overflow-hidden">
              {route.steps.map((step, i) => (
                <React.Fragment key={i}>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                    {step}
                  </span>
                  {i < route.steps.length - 1 && (
                    <div className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
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
"use client";

import React from 'react';
import { ArrowLeft, Clock, MapPin, Train, Bus, Zap, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RouteDetailsProps {
  route: any;
  onBack: () => void;
}

const RouteDetails = ({ route, onBack }: RouteDetailsProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-100 overflow-hidden flex flex-col h-full pointer-events-auto animate-in slide-in-from-right-4 duration-300">
      <div className="p-4 border-b border-gray-50 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="font-bold text-gray-900">Détails de l'itinéraire</h2>
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Ligne {route.line}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Summary Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", route.color)}>
              {route.type === 'Tramway' && <Train size={28} />}
              {route.type === 'Busway' && <Zap size={28} />}
              {route.type === 'Bus' && <Bus size={28} />}
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{route.duration}</div>
              <div className="text-sm font-medium text-gray-500">Arrivée prévue à {route.arrival}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-emerald-600">{route.price}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Tarif unique</div>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-0 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
          
          <div className="relative pl-10 pb-8">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="font-bold text-gray-900">Point de départ</div>
            <div className="text-xs text-gray-500 mt-1">Marche 5 min (400m)</div>
          </div>

          <div className="relative pl-10 pb-8">
            <div className={cn("absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center", route.color)}>
              {route.type === 'Tramway' && <Train size={10} className="text-white" />}
              {route.type === 'Busway' && <Zap size={10} className="text-white" />}
              {route.type === 'Bus' && <Bus size={10} className="text-white" />}
            </div>
            <div className="font-bold text-gray-900">Station {route.line}</div>
            <div className="text-xs text-gray-500 mt-1">Direction {route.type === 'Tramway' ? 'Sidi Moumen' : 'Lissasfa'}</div>
            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-700">Prochain passage: 4 min</span>
              </div>
              <Info size={14} className="text-gray-400" />
            </div>
          </div>

          <div className="relative pl-10">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-red-50 border-4 border-white shadow-sm flex items-center justify-center">
              <MapPin size={12} className="text-red-500" />
            </div>
            <div className="font-bold text-gray-900">Destination</div>
            <div className="text-xs text-gray-500 mt-1">Arrivée à destination</div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl">
          Démarrer le trajet
        </button>
      </div>
    </div>
  );
};

export default RouteDetails;
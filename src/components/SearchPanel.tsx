"use client";

import React from 'react';
import { MapPin, Navigation, Train, Bus, Zap, X, MousePointer2 } from 'lucide-react';

interface SearchPanelProps {
  origin: [number, number] | null;
  destination: [number, number] | null;
  onReset: () => void;
}

const SearchPanel = ({ origin, destination, onReset }: SearchPanelProps) => {
  const isReady = origin && destination;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-md mx-auto border border-gray-100 pointer-events-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-emerald-600 tracking-tight">Casablanca</h2>
        {(origin || destination) && (
          <button 
            onClick={onReset}
            className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500"
            title="Réinitialiser"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-transparent transition-all">
          <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${origin ? 'bg-blue-500' : 'bg-gray-300 animate-pulse'}`} />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Départ</p>
            <p className="text-sm font-medium text-gray-700">
              {origin ? `${origin[0].toFixed(4)}, ${origin[1].toFixed(4)}` : "Cliquez sur la carte pour choisir"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-transparent transition-all">
          <MapPin size={16} className={destination ? 'text-red-500' : 'text-gray-300'} />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Arrivée</p>
            <p className="text-sm font-medium text-gray-700">
              {destination ? `${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}` : origin ? "Cliquez pour choisir l'arrivée" : "En attente du départ..."}
            </p>
          </div>
        </div>
      </div>

      {!isReady && (
        <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2 rounded-lg border border-emerald-100">
          <MousePointer2 size={14} className="animate-bounce" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Sélectionnez sur la carte</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mt-6">
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
          <Train size={18} className="mb-1 text-emerald-600" />
          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-tighter">Tramway</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50/50 border border-blue-100">
          <Zap size={18} className="mb-1 text-blue-600" />
          <span className="text-[9px] font-bold text-blue-700 uppercase tracking-tighter">Busway</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-orange-50/50 border border-orange-100">
          <Bus size={18} className="mb-1 text-orange-600" />
          <span className="text-[9px] font-bold text-orange-700 uppercase tracking-tighter">Bus</span>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
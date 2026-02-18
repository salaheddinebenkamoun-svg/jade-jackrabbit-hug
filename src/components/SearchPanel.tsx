"use client";

import React, { useState } from 'react';
import { Search, MapPin, Navigation, ArrowRightLeft, Train, Bus, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchPanelProps {
  onSearch: (from: string, to: string) => void;
  onSelectCurrentLocation: () => void;
}

const SearchPanel = ({ onSearch, onSelectCurrentLocation }: SearchPanelProps) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSearch = () => {
    if (from && to) {
      onSearch(from, to);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-md mx-auto border border-gray-100 pointer-events-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-emerald-600 tracking-tight">Casablanca</h2>
        <div className="flex gap-2">
          <button 
            onClick={onSelectCurrentLocation}
            className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-600"
            title="Utiliser ma position"
          >
            <Navigation size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3 relative">
        {/* Vertical line connecting dots */}
        <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-gray-100 z-0" />
        
        <div className="relative z-10">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Point de départ"
            className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="relative z-10">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MapPin size={16} className="text-red-500" />
          </div>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Où allez-vous ?"
            className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      <button 
        onClick={handleSearch}
        disabled={!from || !to}
        className="w-full mt-4 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-200"
      >
        Rechercher l'itinéraire
      </button>

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
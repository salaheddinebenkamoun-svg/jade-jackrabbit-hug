"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchPanelProps {
  originName: string;
  destinationName: string;
  onSelectLocation: (type: 'origin' | 'destination', latlng: [number, number], name: string) => void;
  onReset: () => void;
}

const SearchPanel = ({ originName, destinationName, onSelectLocation, onReset }: SearchPanelProps) => {
  const [queries, setQueries] = useState({ origin: originName, destination: destinationName });
  const [suggestions, setSuggestions] = useState<{ type: 'origin' | 'destination', items: any[] } | null>(null);

  useEffect(() => {
    setQueries({ origin: originName, destination: destinationName });
  }, [originName, destinationName]);

  const search = async (query: string, type: 'origin' | 'destination') => {
    if (query.length < 3) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + " Casablanca")}&limit=5`);
      const data = await res.json();
      setSuggestions({ type, items: data });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-emerald-600 p-6 rounded-b-[40px] shadow-2xl pointer-events-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-emerald-600 rounded-sm rotate-45" />
          </div>
          <h1 className="text-white text-xl font-black tracking-tight">Casablanca</h1>
        </div>
        <button onClick={onReset} className="text-white/80 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-inner relative">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-emerald-600 w-10 uppercase">Start</span>
            <input
              type="text"
              placeholder="Point de départ"
              value={queries.origin}
              onChange={(e) => {
                setQueries(p => ({ ...p, origin: e.target.value }));
                search(e.target.value, 'origin');
              }}
              className="flex-1 text-sm font-bold text-gray-800 focus:outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="h-[1px] bg-gray-100 ml-12" />
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-red-500 w-10 uppercase">End</span>
            <input
              type="text"
              placeholder="Où allez-vous ?"
              value={queries.destination}
              onChange={(e) => {
                setQueries(p => ({ ...p, destination: e.target.value }));
                search(e.target.value, 'destination');
              }}
              className="flex-1 text-sm font-bold text-gray-800 focus:outline-none placeholder:text-gray-300"
            />
          </div>
        </div>

        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
          <ArrowUpDown size={16} />
        </button>

        {suggestions && suggestions.items.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            {suggestions.items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelectLocation(suggestions.type, [parseFloat(item.lat), parseFloat(item.lon)], item.display_name);
                  setSuggestions(null);
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 border-b border-gray-50 last:border-none flex items-center gap-3"
              >
                <MapPin size={16} className="text-gray-400" />
                <span className="truncate font-bold text-gray-700">{item.display_name.split(',')[0]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
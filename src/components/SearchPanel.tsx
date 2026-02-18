"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Search, X, Loader2, ArrowUpDown, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchPanelProps {
  origin: [number, number] | null;
  destination: [number, number] | null;
  onSelectLocation: (type: 'origin' | 'destination', latlng: [number, number], name: string) => void;
  onReset: () => void;
}

const SearchPanel = ({ origin, destination, onSelectLocation, onReset }: SearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState({ origin: '', destination: '' });
  const [suggestions, setSuggestions] = useState<{ type: 'origin' | 'destination', items: any[] }>({ type: 'origin', items: [] });
  const [loading, setLoading] = useState(false);

  const searchLocation = async (query: string, type: 'origin' | 'destination') => {
    if (query.length < 3) return;
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + " Casablanca")}&limit=5`);
      const data = await response.json();
      setSuggestions({ type, items: data });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.origin && !origin) searchLocation(searchQuery.origin, 'origin');
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery.origin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.destination && !destination) searchLocation(searchQuery.destination, 'destination');
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery.destination]);

  const handleSelect = (item: any, type: 'origin' | 'destination') => {
    const latlng: [number, number] = [parseFloat(item.lat), parseFloat(item.lon)];
    onSelectLocation(type, latlng, item.display_name);
    setSearchQuery(prev => ({ ...prev, [type]: item.display_name.split(',')[0] }));
    setSuggestions({ type, items: [] });
  };

  return (
    <div className="w-full max-w-md mx-auto pointer-events-auto">
      {/* Header Style Citymapper */}
      <div className="bg-[#28a745] p-4 rounded-t-[32px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
            <Menu className="text-white" size={24} />
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px]">🇲🇦</div>
            <span className="text-white font-bold text-sm">Casablanca</span>
          </div>
        </div>
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl shadow-lg">
          😍
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white p-5 shadow-2xl border-x border-b border-gray-100 relative">
        <div className="space-y-0 relative">
          {/* Origin */}
          <div className="relative flex items-center border-b border-gray-100 pb-3">
            <span className="text-[#28a745] font-bold text-sm w-12">Start</span>
            <input
              type="text"
              placeholder="Point de départ"
              value={searchQuery.origin}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, origin: e.target.value }))}
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 font-medium placeholder:text-gray-300"
            />
            {searchQuery.origin && (
              <button onClick={() => setSearchQuery(prev => ({ ...prev, origin: '' }))} className="text-gray-300 hover:text-gray-500">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Destination */}
          <div className="relative flex items-center pt-3">
            <span className="text-[#ff3b30] font-bold text-sm w-12">End</span>
            <input
              type="text"
              placeholder="Où allez-vous ?"
              value={searchQuery.destination}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, destination: e.target.value }))}
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 font-medium placeholder:text-gray-300"
            />
            {searchQuery.destination && (
              <button onClick={() => setSearchQuery(prev => ({ ...prev, destination: '' }))} className="text-gray-300 hover:text-gray-500">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Swap Button */}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors z-10 border-2 border-white">
            <ArrowUpDown size={16} />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.items.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            {suggestions.items.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item, suggestions.type)}
                className="w-full px-5 py-4 text-left hover:bg-gray-50 border-b border-gray-50 last:border-none flex items-center gap-4 group"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <MapPin size={16} className="text-gray-400 group-hover:text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">{item.display_name.split(',')[0]}</p>
                  <p className="text-xs text-gray-400 truncate">{item.display_name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Time Selector */}
      <div className="bg-white p-4 rounded-b-[32px] border-t border-gray-50 flex items-center gap-2 text-[#28a745] font-bold text-sm cursor-pointer hover:bg-gray-50 transition-colors">
        <span>Now</span>
        <ArrowUpDown size={14} className="rotate-90" />
      </div>
    </div>
  );
};

export default SearchPanel;
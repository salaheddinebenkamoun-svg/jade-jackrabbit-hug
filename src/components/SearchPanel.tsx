"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Search, X, Loader2, Navigation } from 'lucide-react';
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
      // Using Nominatim (OpenStreetMap) for free geocoding
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
    <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md mx-auto border border-gray-100 pointer-events-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-emerald-600 tracking-tight">CasaWay</h2>
        {(origin || destination) && (
          <button onClick={onReset} className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-4 relative">
        {/* Origin Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10" />
          <input
            type="text"
            placeholder="Point de départ"
            value={searchQuery.origin}
            onChange={(e) => setSearchQuery(prev => ({ ...prev, origin: e.target.value }))}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {suggestions.type === 'origin' && suggestions.items.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              {suggestions.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item, 'origin')}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-50 last:border-none flex items-center gap-3"
                >
                  <MapPin size={16} className="text-gray-400" />
                  <span className="truncate font-medium">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <MapPin size={18} className="text-red-500 z-10" />
          </div>
          <input
            type="text"
            placeholder="Où allez-vous ?"
            value={searchQuery.destination}
            onChange={(e) => setSearchQuery(prev => ({ ...prev, destination: e.target.value }))}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {suggestions.type === 'destination' && suggestions.items.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              {suggestions.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item, 'destination')}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-50 last:border-none flex items-center gap-3"
                >
                  <MapPin size={16} className="text-gray-400" />
                  <span className="truncate font-medium">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 size={18} className="animate-spin text-emerald-500" />
          </div>
        )}
      </div>

      {!origin && !destination && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <Navigation size={16} />
          </div>
          <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Tapez un lieu ou cliquez sur la carte
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
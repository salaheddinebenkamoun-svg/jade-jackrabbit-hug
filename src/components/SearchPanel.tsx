"use client";

import React from 'react';
import { Search, MapPin, Navigation, ArrowRightLeft, Train, Bus, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchPanelProps {
  onSearch: (from: string, to: string) => void;
}

const SearchPanel = ({ onSearch }: SearchPanelProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-md mx-auto border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-emerald-600">Casablanca Transport</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowRightLeft size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
          <input
            type="text"
            placeholder="Ma position"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MapPin size={16} className="text-red-500" />
          </div>
          <input
            type="text"
            placeholder="Où allez-vous ?"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
          <Train size={20} className="mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Tramway</span>
        </button>
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
          <Zap size={20} className="mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Busway</span>
        </button>
        <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors">
          <Bus size={20} className="mb-1" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Bus</span>
        </button>
      </div>
    </div>
  );
};

export default SearchPanel;
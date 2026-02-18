"use client";

import React from 'react';
import { Footprints, Bike, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModeOption {
  id: 'foot' | 'bike' | 'car';
  label: string;
  icon: any;
  duration: number;
  extra: string;
}

interface ModeSelectorProps {
  options: ModeOption[];
  selectedMode: string;
  onSelect: (id: 'foot' | 'bike' | 'car') => void;
}

const ModeSelector = ({ options, selectedMode, onSelect }: ModeSelectorProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex divide-x divide-gray-100 pointer-events-auto">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "flex-1 py-4 px-2 flex flex-col items-center justify-center transition-all relative",
            selectedMode === opt.id ? "bg-emerald-50/50" : "hover:bg-gray-50"
          )}
        >
          <div className={cn(
            "mb-1 transition-colors",
            selectedMode === opt.id ? "text-emerald-600" : "text-gray-400"
          )}>
            {opt.id === 'foot' && <Footprints size={24} />}
            {opt.id === 'bike' && <Bike size={24} />}
            {opt.id === 'car' && <Car size={24} />}
          </div>
          <div className="text-right w-full px-2">
            <span className="block text-lg font-black text-gray-900 leading-none">{opt.duration}</span>
            <span className="block text-[10px] font-bold text-gray-400 uppercase">min</span>
          </div>
          <div className="mt-1">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              opt.id === 'foot' ? "text-emerald-600 bg-emerald-50" : 
              opt.id === 'bike' ? "text-blue-600 bg-blue-50" : "text-gray-500 bg-gray-100"
            )}>
              {opt.extra}
            </span>
          </div>
          {selectedMode === opt.id && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
          )}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
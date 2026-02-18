"use client";

import React from 'react';
import { Train, Bus, Zap, ChevronRight, Clock, Footprints, Bike, Car, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const TRANSPORT_OPTIONS = [
  // Personal Transport
  { id: 'foot', type: 'Walk', line: 'Marche', color: 'bg-emerald-500', hex: '#10b981', category: 'personal', icon: Footprints, mode: 'foot' },
  { id: 'bike', type: 'Cycle', line: 'Vélo', color: 'bg-blue-500', hex: '#3b82f6', category: 'personal', icon: Bike, mode: 'bike' },
  { id: 'car', type: 'Cab', line: 'Petit Taxi', color: 'bg-red-500', hex: '#ef4444', category: 'personal', icon: Car, mode: 'car' },
  
  // Tramway
  { id: 't1', type: 'Tramway', line: 'T1', color: 'bg-emerald-600', hex: '#059669', category: 'public', icon: Train, price: '6 MAD', mode: 'public' },
  { id: 't2', type: 'Tramway', line: 'T2', color: 'bg-orange-500', hex: '#f97316', category: 'public', icon: Train, price: '6 MAD', mode: 'public' },
  { id: 't3', type: 'Tramway', line: 'T3', color: 'bg-blue-600', hex: '#2563eb', category: 'public', icon: Train, price: '6 MAD', mode: 'public' },
  { id: 't4', type: 'Tramway', line: 'T4', color: 'bg-purple-600', hex: '#9333ea', category: 'public', icon: Train, price: '6 MAD', mode: 'public' },
  
  // Busway
  { id: 'bw1', type: 'Busway', line: 'BW1', color: 'bg-yellow-500', hex: '#eab308', category: 'public', icon: Zap, price: '6 MAD', mode: 'public' },
  { id: 'bw2', type: 'Busway', line: 'BW2', color: 'bg-lime-500', hex: '#84cc16', category: 'public', icon: Zap, price: '6 MAD', mode: 'public' },
  
  // Bus
  { id: 'bus97', type: 'Bus', line: 'L97', color: 'bg-rose-500', hex: '#f43f5e', category: 'public', icon: Bus, price: '5 MAD', mode: 'public' },
  { id: 'bus7', type: 'Bus', line: 'L7', color: 'bg-indigo-500', hex: '#6366f1', category: 'public', icon: Bus, price: '5 MAD', mode: 'public' },
];

interface SuggestedRoutesProps {
  isVisible: boolean;
  selectedId: string | null;
  onSelect: (id: string, color: string, mode: any) => void;
  modeStats: any;
}

const SuggestedRoutes = ({ isVisible, selectedId, onSelect, modeStats }: SuggestedRoutesProps) => {
  if (!isVisible) return (
    <div className="p-12 text-center flex flex-col items-center justify-center h-full">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <MapPin className="text-emerald-500" size={40} />
      </div>
      <h2 className="text-xl font-black text-gray-900 mb-2">Où allez-vous ?</h2>
      <p className="text-gray-400 text-sm font-medium max-w-[200px]">Sélectionnez un point de départ et d'arrivée pour voir les options.</p>
    </div>
  );

  const personal = TRANSPORT_OPTIONS.filter(o => o.category === 'personal');
  const publicTrans = TRANSPORT_OPTIONS.filter(o => o.category === 'public');

  return (
    <div className="space-y-8 py-6">
      {/* Personal Transport Section */}
      <section>
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 mb-4">Options Individuelles</h3>
        <div className="grid grid-cols-3 gap-3 px-6">
          {personal.map((opt) => {
            const stats = modeStats[opt.id as keyof typeof modeStats];
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id, opt.hex, opt.mode)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300",
                  isSelected 
                    ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/10 -translate-y-1" 
                    : "bg-gray-50 border-transparent hover:bg-white hover:border-gray-200"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center mb-2 transition-colors",
                  isSelected ? opt.color + " text-white" : "bg-white text-gray-400 shadow-sm"
                )}>
                  <opt.icon size={20} />
                </div>
                <span className="text-base font-black text-gray-900 leading-none">{stats?.duration || '--'}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">min</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Public Transport Section */}
      <section>
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 mb-4">Transport Public</h3>
        <div className="space-y-3 px-6">
          {publicTrans.map((opt) => {
            const isSelected = selectedId === opt.id;
            const stats = modeStats['car']; // Base duration for public transport
            return (
              <div
                key={opt.id}
                onClick={() => onSelect(opt.id, opt.hex, opt.mode)}
                className={cn(
                  "bg-white p-5 rounded-[28px] border-2 transition-all duration-300 cursor-pointer flex items-center justify-between group",
                  isSelected 
                    ? "border-emerald-500 shadow-xl shadow-emerald-500/10 -translate-y-1" 
                    : "border-gray-100 hover:border-gray-200 hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110", 
                    opt.color
                  )}>
                    <opt.icon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 text-lg">{opt.line}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-sm font-black text-gray-700">
                        {Math.round(stats?.duration * 1.3) + 8} min
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                      <Clock size={12} className="text-emerald-500" />
                      Toutes les 10 min
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{opt.price}</div>
                  <ChevronRight size={20} className={cn("ml-auto mt-2 transition-colors", isSelected ? "text-emerald-500" : "text-gray-300")} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SuggestedRoutes;
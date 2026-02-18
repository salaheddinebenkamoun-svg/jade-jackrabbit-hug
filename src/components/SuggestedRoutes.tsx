"use client";

import React from 'react';
import { Train, Bus, Zap, ChevronRight, Clock, Footprints, Bike, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

const TRANSPORT_OPTIONS = [
  // Personal Transport
  { id: 'foot', type: 'Walk', line: 'Marche', color: 'bg-emerald-500', hex: '#10b981', category: 'personal', icon: Footprints },
  { id: 'bike', type: 'Cycle', line: 'Vélo', color: 'bg-blue-500', hex: '#3b82f6', category: 'personal', icon: Bike },
  { id: 'car', type: 'Cab', line: 'Petit Taxi', color: 'bg-red-500', hex: '#ef4444', category: 'personal', icon: Car },
  
  // Tramway
  { id: 't1', type: 'Tramway', line: 'T1', color: 'bg-emerald-600', hex: '#059669', category: 'public', icon: Train, duration: '24 min', price: '6 MAD' },
  { id: 't2', type: 'Tramway', line: 'T2', color: 'bg-orange-500', hex: '#f97316', category: 'public', icon: Train, duration: '31 min', price: '6 MAD' },
  { id: 't3', type: 'Tramway', line: 'T3', color: 'bg-blue-600', hex: '#2563eb', category: 'public', icon: Train, duration: '28 min', price: '6 MAD' },
  { id: 't4', type: 'Tramway', line: 'T4', color: 'bg-purple-600', hex: '#9333ea', category: 'public', icon: Train, duration: '35 min', price: '6 MAD' },
  
  // Busway
  { id: 'bw1', type: 'Busway', line: 'BW1', color: 'bg-yellow-500', hex: '#eab308', category: 'public', icon: Zap, duration: '22 min', price: '6 MAD' },
  { id: 'bw2', type: 'Busway', line: 'BW2', color: 'bg-lime-500', hex: '#84cc16', category: 'public', icon: Zap, duration: '26 min', price: '6 MAD' },
  
  // Bus
  { id: 'bus97', type: 'Bus', line: 'L97', color: 'bg-rose-500', hex: '#f43f5e', category: 'public', icon: Bus, duration: '45 min', price: '5 MAD' },
  { id: 'bus7', type: 'Bus', line: 'L7', color: 'bg-indigo-500', hex: '#6366f1', category: 'public', icon: Bus, duration: '38 min', price: '5 MAD' },
];

interface SuggestedRoutesProps {
  isVisible: boolean;
  selectedId: string | null;
  onSelect: (id: string, color: string, mode: any) => void;
  modeStats: any;
}

const SuggestedRoutes = ({ isVisible, selectedId, onSelect, modeStats }: SuggestedRoutesProps) => {
  if (!isVisible) return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="text-emerald-500" size={32} />
      </div>
      <p className="text-gray-500 font-medium">Choisissez une destination pour voir les trajets</p>
    </div>
  );

  const personal = TRANSPORT_OPTIONS.filter(o => o.category === 'personal');
  const publicTrans = TRANSPORT_OPTIONS.filter(o => o.category === 'public');

  return (
    <div className="space-y-6 pb-24">
      {/* Personal Transport Section */}
      <section>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-3">Options Rapides</h3>
        <div className="grid grid-cols-3 gap-2 px-4">
          {personal.map((opt) => {
            const stats = modeStats[opt.id as keyof typeof modeStats];
            return (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id, opt.hex, opt.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all",
                  selectedId === opt.id ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/10" : "bg-white border-gray-100 hover:border-gray-200"
                )}
              >
                <opt.icon size={20} className={selectedId === opt.id ? "text-emerald-600" : "text-gray-400"} />
                <span className="text-sm font-black text-gray-900 mt-1">{stats?.duration || '--'} min</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">{opt.line}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Public Transport Section */}
      <section>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-3">Transport Public</h3>
        <div className="space-y-2 px-4">
          {publicTrans.map((opt) => (
            <div
              key={opt.id}
              onClick={() => onSelect(opt.id, opt.hex, 'car')} // Using 'car' routing as proxy for public transport path
              className={cn(
                "bg-white p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                selectedId === opt.id ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg" : "border-gray-100 shadow-sm hover:shadow-md"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm", opt.color)}>
                  <opt.icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-gray-900">{opt.line}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm font-bold text-gray-700">{opt.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                    <Clock size={10} />
                    Toutes les 10 min
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-emerald-600">{opt.price}</div>
                <ChevronRight size={16} className={cn("ml-auto mt-1", selectedId === opt.id ? "text-emerald-500" : "text-gray-300")} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

import { MapPin } from 'lucide-react';
export default SuggestedRoutes;
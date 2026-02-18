"use client";

import React from 'react';
import { Train, Bus, Zap, ChevronRight, Clock, Footprints, Bike, Car, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RoutingMode = 'foot' | 'bike' | 'taxi' | 'tramway' | 'busway' | 'bus';

interface TransportOption {
  id: string;
  type: string;
  line: string;
  color: string;
  hex: string;
  category: 'personal' | 'public';
  icon: React.ComponentType<{ size?: number }>;
  price?: string;
  mode: RoutingMode;
}

const TRANSPORT_OPTIONS: TransportOption[] = [
  // Personal Transport
  { id: 'foot', type: 'Walk', line: 'Walk', color: 'bg-emerald-500', hex: '#10b981', category: 'personal', icon: Footprints, mode: 'foot' },
  { id: 'bike', type: 'Cycle', line: 'Cycle', color: 'bg-blue-500', hex: '#2563eb', category: 'personal', icon: Bike, mode: 'bike' },
  { id: 'taxi', type: 'Car', line: 'Car', color: 'bg-amber-500', hex: '#f59e0b', category: 'personal', icon: Car, mode: 'taxi' },

  // Tramway
  { id: 't1', type: 'Tramway', line: 'T1', color: 'bg-red-600', hex: '#dc2626', category: 'public', icon: Train, price: '6 MAD', mode: 'tramway' },
  { id: 't2', type: 'Tramway', line: 'T2', color: 'bg-green-600', hex: '#16a34a', category: 'public', icon: Train, price: '6 MAD', mode: 'tramway' },
  { id: 't3', type: 'Tramway', line: 'T3', color: 'bg-orange-500', hex: '#f97316', category: 'public', icon: Train, price: '6 MAD', mode: 'tramway' },
  { id: 't4', type: 'Tramway', line: 'T4', color: 'bg-sky-600', hex: '#0284c7', category: 'public', icon: Train, price: '6 MAD', mode: 'tramway' },

  // Busway
  { id: 'bw1', type: 'Busway', line: 'BW1', color: 'bg-amber-500', hex: '#f59e0b', category: 'public', icon: Zap, price: '6 MAD', mode: 'busway' },
  { id: 'bw2', type: 'Busway', line: 'BW2', color: 'bg-emerald-600', hex: '#059669', category: 'public', icon: Zap, price: '6 MAD', mode: 'busway' },

  // Bus
  { id: 'bus_lissasfa_nations_unies', type: 'Bus', line: 'Lissasfa ↔ Place des Nations Unies', color: 'bg-violet-500', hex: '#8b5cf6', category: 'public', icon: Bus, price: '5 MAD', mode: 'bus' },
  { id: 'bus_hay_hassani_ain_sebaa', type: 'Bus', line: 'Hay Hassani ↔ Aïn Sebaâ', color: 'bg-blue-500', hex: '#3b82f6', category: 'public', icon: Bus, price: '5 MAD', mode: 'bus' },
  { id: 'bus_sidi_moumen_oulfa', type: 'Bus', line: 'Sidi Moumen ↔ Oulfa', color: 'bg-pink-500', hex: '#ec4899', category: 'public', icon: Bus, price: '5 MAD', mode: 'bus' },
];

interface ModeMetrics {
  duration: number;
  distance: number;
}

interface SuggestedRoutesProps {
  isVisible: boolean;
  selectedId: string | null;
  onSelect: (id: string, color: string, mode: RoutingMode) => void;
  modeStats: Record<RoutingMode, ModeMetrics>;
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

  const personal = TRANSPORT_OPTIONS.filter((o) => o.category === 'personal');
  const publicTrans = TRANSPORT_OPTIONS.filter((o) => o.category === 'public');

  return (
    <div className="space-y-8 py-6">
      <section>
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 mb-4">Options Individuelles</h3>
        <div className="grid grid-cols-3 gap-3 px-6">
          {personal.map((opt) => {
            const stats = modeStats[opt.mode];
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id, opt.hex, opt.mode)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300",
                  isSelected
                    ? "bg-white shadow-xl -translate-y-1"
                    : "bg-gray-50 border-transparent hover:bg-white hover:border-gray-200"
                )}
                style={isSelected ? { borderColor: opt.hex, boxShadow: `${opt.hex}33 0px 12px 25px -18px` } : undefined}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center mb-2 transition-colors",
                  isSelected ? `${opt.color} text-white` : "bg-white text-gray-400 shadow-sm"
                )}>
                  <opt.icon size={20} />
                </div>
                <span className="text-base font-black text-gray-900 leading-none">{stats?.duration || '--'} min</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">{stats?.distance || '--'} km</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-6 mb-4">Transport Public</h3>
        <div className="space-y-3 px-6">
          {publicTrans.map((opt) => {
            const isSelected = selectedId === opt.id;
            const stats = modeStats[opt.mode];
            return (
              <div
                key={opt.id}
                onClick={() => onSelect(opt.id, opt.hex, opt.mode)}
                className={cn(
                  "bg-white p-5 rounded-[28px] border-2 transition-all duration-300 cursor-pointer flex items-center justify-between group",
                  isSelected
                    ? "shadow-xl -translate-y-1"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-md"
                )}
                style={isSelected ? { borderColor: opt.hex, boxShadow: `${opt.hex}30 0px 12px 25px -18px` } : undefined}
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
                      <span className="text-sm font-black text-gray-700">{stats?.duration || '--'} min</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                      <Clock size={12} className="text-emerald-500" />
                      ~ {stats?.distance || '--'} km
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{opt.price}</div>
                  <ChevronRight size={20} className={cn('ml-auto mt-2 transition-colors', isSelected ? 'text-gray-700' : 'text-gray-300')} />
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

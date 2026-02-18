"use client";

import React from 'react';
import { Train, Bus, Zap, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const TRANSPORT_OPTIONS = [
  { id: 't1', type: 'Tramway', line: 'T1', color: 'bg-emerald-500', text: 'text-emerald-500', duration: '24 min', price: '6 MAD', steps: ['Marche 3 min', 'T1', 'Marche 2 min'] },
  { id: 't2', type: 'Tramway', line: 'T2', color: 'bg-orange-500', text: 'text-orange-500', duration: '31 min', price: '6 MAD', steps: ['Marche 5 min', 'T2', 'Marche 4 min'] },
  { id: 'bw1', type: 'Busway', line: 'BW1', color: 'bg-blue-500', text: 'text-blue-500', duration: '28 min', price: '6 MAD', steps: ['Marche 2 min', 'BW1', 'Marche 6 min'] },
  { id: 'bw2', type: 'Busway', line: 'BW2', color: 'bg-purple-500', text: 'text-purple-500', duration: '35 min', price: '6 MAD', steps: ['Marche 8 min', 'BW2', 'Marche 3 min'] },
  { id: 'bus', type: 'Bus', line: 'L97', color: 'bg-rose-500', text: 'text-rose-500', duration: '45 min', price: '5 MAD', steps: ['Marche 1 min', 'Bus 97', 'Marche 10 min'] },
];

interface SuggestedRoutesProps {
  isVisible: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const SuggestedRoutes = ({ isVisible, selectedId, onSelect }: SuggestedRoutesProps) => {
  if (!isVisible) return null;

  return (
    <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Transport Public</h3>
      {TRANSPORT_OPTIONS.map((opt) => (
        <div
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "bg-white p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98]",
            selectedId === opt.id ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-xl" : "border-gray-100 shadow-sm hover:shadow-md"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", opt.color)}>
                {opt.type === 'Tramway' ? <Train size={24} /> : opt.type === 'Busway' ? <Zap size={24} /> : <Bus size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 text-lg">{opt.line}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-sm font-black text-gray-700">{opt.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                  <Clock size={10} />
                  Toutes les 8 min
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={cn("text-xs font-black", opt.text)}>{opt.price}</div>
              <ChevronRight size={18} className={cn("ml-auto mt-1 transition-colors", selectedId === opt.id ? "text-emerald-500" : "text-gray-300")} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {opt.steps.map((step, i) => (
              <React.Fragment key={i}>
                <span className="text-[9px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 uppercase">
                  {step}
                </span>
                {i < opt.steps.length - 1 && <div className="w-1 h-1 rounded-full bg-gray-200" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestedRoutes;
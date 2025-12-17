
import React from 'react';
import { MonthOption } from '../types';
import { Plus, Calendar } from 'lucide-react';
import TimelineControl from './TimelineControl';

interface SideNavigationProps {
  months: MonthOption[];
  selectedMonth: MonthOption;
  onSelect: (month: MonthOption) => void;
  onOpenSubmitEvent: () => void;
  onOpenSubmitConference: () => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ 
  months, 
  selectedMonth, 
  onSelect,
  onOpenSubmitEvent,
  onOpenSubmitConference
}) => {
  
  return (
    <>
      {/* --- MOBILE NAVIGATION (Top Strip) --- */}
      <div className="lg:hidden w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
             <div className="font-bold text-white text-sm tracking-tight">Conference Nights</div>
             <button 
                onClick={onOpenSubmitEvent}
                className="text-white text-xs font-medium border border-white/10 bg-white/5 px-3 py-1.5 rounded-md"
             >
                List Event
             </button>
        </div>
        
        {/* Horizontal Scroll Month Selector */}
        <div className="flex overflow-x-auto no-scrollbar px-4 py-2 gap-6 border-t border-white/5 bg-background/50">
            {months.map(m => {
                const isActive = m.label === selectedMonth.label;
                return (
                    <button
                        key={m.label}
                        onClick={() => onSelect(m)}
                        className={`
                            whitespace-nowrap text-xs font-medium transition-colors relative py-2
                            ${isActive ? 'text-white' : 'text-txt-dim hover:text-txt-muted'}
                        `}
                    >
                        {m.label}
                        {isActive && <div className="absolute bottom-0 left-0 right-0 h-px bg-primary" />}
                    </button>
                )
            })}
        </div>
      </div>

      {/* --- DESKTOP SIDEBAR (Left) --- */}
      <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 left-0 border-r border-white/[0.06] bg-background z-50">
        
        {/* 1. Header Area */}
        <div className="px-6 pt-8 pb-6">
            <div className="mb-8 cursor-pointer">
                <h1 className="text-sm font-bold text-white tracking-wide">
                    Conference Nights
                </h1>
                <p className="text-[10px] text-txt-dim uppercase tracking-widest mt-1">Event Directory</p>
            </div>

            {/* 2. Primary Actions (CTA) */}
            <div className="flex flex-col gap-2">
                <button 
                    onClick={onOpenSubmitEvent}
                    className="w-full bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> List Side-Event
                </button>
                <button 
                    onClick={onOpenSubmitConference}
                    className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-txt-muted hover:text-white px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-2"
                >
                    <Calendar size={14} /> Submit Conference
                </button>
            </div>
        </div>

        {/* 3. Timeline Navigation (Rail) */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
            <div className="mb-4 text-[10px] font-bold text-txt-dim uppercase tracking-widest opacity-50">Timeline</div>
            <TimelineControl 
                months={months}
                selectedMonth={selectedMonth}
                onSelect={onSelect}
            />
        </div>
      </aside>
    </>
  );
};

export default SideNavigation;
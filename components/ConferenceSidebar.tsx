
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Plus, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { Conference, MonthOption } from '../types';

interface ConferenceSidebarProps {
  months: MonthOption[];
  selectedMonth: MonthOption;
  onSelectMonth: (month: MonthOption) => void;
  conferences: Conference[];
  selectedConferenceId: string;
  onSelect: (id: string) => void;
  onOpenSubmitModal: () => void;
}

const ConferenceSidebar: React.FC<ConferenceSidebarProps> = ({ 
  months,
  selectedMonth,
  onSelectMonth,
  conferences, 
  selectedConferenceId, 
  onSelect, 
  onOpenSubmitModal 
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  const currentIndex = months.findIndex(m => m.label === selectedMonth.label);
  
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) onSelectMonth(months[currentIndex - 1]);
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < months.length - 1) onSelectMonth(months[currentIndex + 1]);
  };

  // Safely extract parts
  const parts = selectedMonth.label.split(' ');
  const monthLabel = parts[0] || ''; 
  const yearLabel = parts[1] || '';

  // Group months by year
  const monthsByYear = months.reduce((acc, month) => {
    if (!acc[month.year]) acc[month.year] = [];
    acc[month.year].push(month);
    return acc;
  }, {} as Record<number, MonthOption[]>);
  
  const sortedYears = Object.keys(monthsByYear).map(Number).sort((a, b) => a - b);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };

    if (isPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPickerOpen]);

  return (
    <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-[88px] h-fit self-start animate-fade-in">
      
      {/* 1. Structural Timeline Anchor (New Month Nav) */}
      <div 
        ref={pickerRef}
        className="bg-surface border border-white/5 rounded-3xl p-6 relative shadow-lg z-20"
      >
        {/* Background Effects - Clipped to container shape to maintain design while allowing dropdown overflow */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Clickable Header Area */}
        <div 
            className="relative z-20 cursor-pointer group"
            onClick={() => setIsPickerOpen(!isPickerOpen)}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-primary uppercase tracking-widest group-hover:text-primaryHover transition-colors">
                    {yearLabel}
                </span>
                <div className="flex gap-1">
                    <button 
                        onClick={handlePrevMonth}
                        disabled={currentIndex <= 0}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-txt-dim hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={handleNextMonth}
                        disabled={currentIndex >= months.length - 1}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-txt-dim hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="flex items-baseline gap-1">
                <h2 className="text-5xl font-bold text-white tracking-tighter group-hover:text-white/90 transition-colors">
                    {monthLabel.toUpperCase()}
                </h2>
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse mb-2 ml-1"></div>
            </div>
        </div>
        
        <div className="w-full h-px bg-white/10 mt-6 mb-2" />

        {/* Month Selection Panel */}
        {isPickerOpen && (
            <div className="absolute top-[100px] left-0 w-full px-6 z-50 animate-fade-in-up origin-top">
                <div className="bg-surfaceHighlight border border-white/10 rounded-2xl shadow-2xl p-4 max-h-[300px] overflow-y-auto custom-scrollbar backdrop-blur-xl">
                    {sortedYears.map(year => (
                        <div key={year} className="mb-4 last:mb-0">
                            <div className="text-[10px] font-bold text-txt-dim uppercase tracking-widest mb-2 sticky top-0 bg-surfaceHighlight/95 backdrop-blur-md py-1 z-10">
                                {year}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {monthsByYear[year].map(m => {
                                    const isSelected = m.label === selectedMonth.label;
                                    const mName = m.label.split(' ')[0];
                                    return (
                                        <button
                                            key={m.label}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectMonth(m);
                                                setIsPickerOpen(false);
                                            }}
                                            className={`
                                                text-sm py-2 rounded-lg transition-all duration-200
                                                ${isSelected 
                                                    ? 'bg-primary/10 text-primary font-bold border border-primary/20 shadow-[0_0_10px_rgba(45,212,191,0.1)]' 
                                                    : 'text-txt-muted hover:text-white hover:bg-white/5 border border-transparent'}
                                            `}
                                        >
                                            {mName}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* 2. Conference List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
             <h2 className="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em]">Venues & Conferences</h2>
             <span className="text-[10px] font-bold text-txt-dim bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">{conferences.length}</span>
        </div>

        {/* Updated Container: Fixed Height + Scrollbar */}
        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {conferences.map((conf) => {
            const isSelected = conf.id === selectedConferenceId;
            return (
                <button
                key={conf.id}
                onClick={() => onSelect(conf.id)}
                className={`
                    group text-left p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden w-full shrink-0
                    ${isSelected 
                    ? 'bg-surfaceHighlight border-primary shadow-[0_0_20px_rgba(45,212,191,0.1)]' 
                    : 'bg-surface border-white/5 hover:border-white/10 hover:bg-white/[0.03]'}
                `}
                >
                {/*  Selection Indicator */}
                 {isSelected && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-fade-in">
                        <ChevronRight size={18} />
                    </div>
                 )}

                <div className="flex flex-col gap-3 relative z-10">
                    <h3 className={`font-bold text-[15px] pr-8 leading-snug transition-colors ${isSelected ? 'text-white' : 'text-txt-main group-hover:text-white'}`}>
                        {conf.name}
                    </h3>
                    
                    <div className="flex flex-col gap-1.5">
                         <div className={`flex items-center gap-2 text-xs transition-colors ${isSelected ? 'text-txt-muted' : 'text-txt-dim'}`}>
                            <MapPin size={13} className={isSelected ? 'text-primary' : 'text-txt-dim group-hover:text-txt-muted'} />
                            <span className="truncate">{conf.location}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-xs transition-colors ${isSelected ? 'text-txt-muted' : 'text-txt-dim'}`}>
                            <Calendar size={13} className={isSelected ? 'text-primary' : 'text-txt-dim group-hover:text-txt-muted'} />
                            <span>{conf.dateRange}</span>
                        </div>
                    </div>
                </div>
                </button>
            );
            })}
            
            {conferences.length === 0 && (
            <div className="p-8 text-sm text-txt-dim text-center border border-dashed border-white/10 rounded-2xl bg-surface/30">
                No conferences found for {monthLabel}.
            </div>
            )}
        </div>
      </div>

      <button 
        onClick={onOpenSubmitModal}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-white/10 hover:border-primary/30 hover:bg-primary/5 text-txt-muted hover:text-primary py-4 rounded-2xl text-xs font-bold transition-all group mt-2"
      >
        <Plus size={14} />
        Submit a Conference
      </button>
    </div>
  );
};

export default ConferenceSidebar;

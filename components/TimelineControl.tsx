
import React from 'react';
import { MonthOption } from '../types';

interface TimelineControlProps {
  months: MonthOption[];
  selectedMonth: MonthOption;
  onSelect: (month: MonthOption) => void;
}

const TimelineControl: React.FC<TimelineControlProps> = ({ months, selectedMonth, onSelect }) => {
  // Group months by year for the rail
  const monthsByYear: { [year: number]: MonthOption[] } = {};
  months.forEach(m => {
    if (!monthsByYear[m.year]) monthsByYear[m.year] = [];
    monthsByYear[m.year].push(m);
  });

  const years = Object.keys(monthsByYear).map(Number).sort((a, b) => a - b);

  return (
    <div className="relative pl-2">
      {/* Vertical Rail Line */}
      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10" />

      <div className="space-y-8">
        {years.map(year => (
          <div key={year} className="relative">
            {/* Year Header */}
            <div className="text-[10px] font-bold text-txt-dim uppercase tracking-widest mb-4 pl-6 relative">
               <span className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-3 h-px bg-white/10"></span>
               {year}
            </div>

            <div className="flex flex-col gap-3">
              {monthsByYear[year].map(month => {
                const isSelected = month.label === selectedMonth.label;
                const monthName = month.label.split(' ')[0]; // Extract "Dec", "Jan"

                return (
                  <button
                    key={month.label}
                    onClick={() => onSelect(month)}
                    className="group relative flex items-center pl-6 py-1 text-left outline-none"
                  >
                    {/* Active Dot Indicator on Rail */}
                    <div 
                        className={`absolute left-[2px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 z-10
                        ${isSelected 
                            ? 'bg-primary ring-4 ring-primary/10 scale-125' 
                            : 'bg-surface border border-white/20 group-hover:border-primary/50 group-hover:scale-110'}`} 
                    />

                    {/* Label */}
                    <span 
                        className={`text-sm tracking-wide transition-all duration-300 
                        ${isSelected 
                            ? 'text-white font-semibold translate-x-1' 
                            : 'text-txt-dim font-medium group-hover:text-txt-muted'}`}
                    >
                        {monthName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineControl;

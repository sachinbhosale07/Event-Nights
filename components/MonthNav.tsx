import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthOption } from '../types';

interface MonthNavProps {
  months: MonthOption[];
  selectedMonth: MonthOption;
  onSelect: (month: MonthOption) => void;
}

const MonthNav: React.FC<MonthNavProps> = ({ months, selectedMonth, onSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust scroll distance
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full bg-background/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-center">
        
        {/* Carousel Container */}
        <div className="relative flex items-center max-w-4xl w-full">
            
            {/* Left Arrow */}
            <button 
                onClick={() => scroll('left')}
                className="absolute left-0 z-10 p-2 rounded-full bg-surfaceHighlight/50 hover:bg-surfaceHighlight text-gray-400 hover:text-white transition-all backdrop-blur-sm border border-white/10 shadow-lg -ml-4 md:-ml-12 hidden md:flex"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 md:hidden pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 md:hidden pointer-events-none" />

            {/* Scrollable List */}
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto no-scrollbar gap-2 px-1 py-2 w-full scroll-smooth items-center snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {months.map((month) => {
                const isSelected = month.label === selectedMonth.label;
                return (
                    <button
                    key={month.label}
                    onClick={() => onSelect(month)}
                    className={`
                        flex-shrink-0 snap-center whitespace-nowrap px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border
                        ${isSelected 
                        ? 'bg-white/10 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-105' 
                        : 'bg-transparent text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5'}
                    `}
                    >
                    {month.label}
                    </button>
                );
                })}
            </div>

            {/* Right Arrow */}
            <button 
                onClick={() => scroll('right')}
                className="absolute right-0 z-10 p-2 rounded-full bg-surfaceHighlight/50 hover:bg-surfaceHighlight text-gray-400 hover:text-white transition-all backdrop-blur-sm border border-white/10 shadow-lg -mr-4 md:-mr-12 hidden md:flex"
            >
                <ChevronRight size={20} />
            </button>
        </div>

      </div>
    </div>
  );
};

export default MonthNav;
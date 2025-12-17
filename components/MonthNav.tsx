import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthOption } from '../types';

interface MonthNavProps {
  months: MonthOption[];
  selectedMonth: MonthOption;
  onSelect: (month: MonthOption) => void;
}

const MonthNav: React.FC<MonthNavProps> = ({ months, selectedMonth, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [months]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full pointer-events-none">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-white/5 h-full -z-10" />
      
      <div className="container mx-auto px-4 py-3 pointer-events-auto">
        <div className="relative max-w-3xl mx-auto group">
          
          {/* Left Gradient Mask & Button */}
          <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background via-background/90 to-transparent z-10 flex items-center transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button 
              onClick={() => scroll('left')}
              className="h-8 w-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-txt-muted hover:text-white hover:border-primary/50 transition-all shadow-lg ml-2"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto no-scrollbar gap-1.5 scroll-smooth py-1 px-2 items-center justify-start md:justify-center min-w-full"
          >
            {months.map((month) => {
              const isSelected = month.label === selectedMonth.label;
              return (
                <button
                  key={month.label}
                  onClick={() => onSelect(month)}
                  className={`
                    relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0
                    ${isSelected 
                      ? 'text-background font-bold shadow-glow transform scale-105' 
                      : 'text-txt-dim hover:text-white hover:bg-white/5'}
                  `}
                >
                  {/* Background for selected state */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary rounded-full -z-10 animate-fade-in" />
                  )}
                  {month.label}
                </button>
              );
            })}
          </div>

          {/* Right Gradient Mask & Button */}
          <div className={`absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background via-background/90 to-transparent z-10 flex items-center justify-end transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button 
              onClick={() => scroll('right')}
              className="h-8 w-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-txt-muted hover:text-white hover:border-primary/50 transition-all shadow-lg mr-2"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MonthNav;
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const SimpleHeader: React.FC = () => {
  return (
    <div className="w-full border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-bold text-white text-xs">CN</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
              Conference Nights
            </span>
        </Link>
        <Link to="/" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            <ChevronLeft size={16} /> <span className="hidden sm:inline">Back to Events</span>
        </Link>
      </div>
    </div>
  );
};

export default SimpleHeader;
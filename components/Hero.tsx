import React from 'react';
import { Instagram, Facebook, Mail, Info, Plus, ChevronRight } from 'lucide-react';

interface HeroProps {
  onOpenSubmitEventModal: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenSubmitEventModal }) => {
  return (
    <div className="relative w-full text-white overflow-hidden pb-12 border-b border-white/5">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-background pointer-events-none">
        <div className="absolute top-[-30%] left-[50%] -translate-x-1/2 w-[1000px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[100px]" />
        {/* Starry texture */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-6">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-16 md:mb-24">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-bold text-white text-xs md:text-sm">CN</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
              Conference Nights
            </span>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center gap-5 text-gray-500">
              <a href="#" className="hover:text-white transition-colors duration-200"><Instagram size={18} /></a>
              <a href="#" className="hover:text-white transition-colors duration-200"><Facebook size={18} /></a>
              <a href="#" className="hover:text-white transition-colors duration-200"><Mail size={18} /></a>
            </div>
            <div className="w-px h-6 bg-white/10 hidden lg:block"></div>
            
            <button 
              onClick={onOpenSubmitEventModal}
              className="bg-white/5 hover:bg-white/10 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border border-white/10 flex items-center gap-2 group hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            >
              <Plus size={14} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="hidden sm:inline">List Your Event</span>
              <span className="sm:hidden">List</span>
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm animate-fade-in-up">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Live Directory</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] md:leading-[1.1]">
            <span className="block text-white drop-shadow-xl">The Ultimate Directory for</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              Conference Parties & Side-Events
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Discover the best networking dinners, happy hours, and secret meetups happening around your favorite conferences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto w-full">
            <div className="relative w-full group">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
               <input 
                type="email" 
                placeholder="Enter your email for updates" 
                className="relative w-full bg-black/50 border border-white/10 rounded-full pl-6 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-black/70 transition-all duration-300 text-sm md:text-base backdrop-blur-xl"
              />
            </div>
            <button className="w-full sm:w-auto whitespace-nowrap bg-white text-black hover:bg-gray-100 font-bold px-8 py-3.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Join the list <ChevronRight size={16} />
            </button>
          </div>
          <p className="mt-6 text-xs text-gray-600 font-medium">Join 15,000+ industry professionals receiving weekly updates.</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
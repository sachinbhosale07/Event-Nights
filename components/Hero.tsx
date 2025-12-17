import React, { useState } from 'react';
import { ArrowRight, Sparkles, Plus } from 'lucide-react';

interface HeroProps {
  onOpenSubmitEventModal: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenSubmitEventModal }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
     const baseUrl = "https://affninja.beehiiv.com/";
     const url = email ? `${baseUrl}?email=${encodeURIComponent(email)}` : baseUrl;
     window.open(url, '_blank');
  };

  return (
    <div className="relative w-full bg-background overflow-hidden">
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full z-50 px-6 py-6">
         <div className="container mx-auto max-w-6xl flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                <span className="font-bold text-primary text-sm">CN</span>
             </div>
             <span className="text-xl font-bold text-white tracking-tight hidden md:block">Conference Nights</span>
           </div>
           
           <button 
             onClick={onOpenSubmitEventModal}
             className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all backdrop-blur-md flex items-center gap-2 group"
           >
             <Plus size={16} className="text-primary group-hover:scale-110 transition-transform" /> 
             <span>List Side-Event</span>
           </button>
         </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute top-20 left-10 w-1 h-1 bg-white/20 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse delay-700" />
      
      {/* Main Hero Content */}
      <div className="relative z-10 px-6 pt-32 pb-24 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in hover:bg-primary/20 transition-colors cursor-default">
             <Sparkles size={12} className="text-primary" />
             <span className="text-[11px] font-bold text-primary tracking-wider uppercase">The Insider's Directory</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Unlock the best <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary relative inline-block pb-2">
               side-events
               <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
               </svg>
            </span>
          </h1>
          
          <p className="text-txt-muted text-lg md:text-xl mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Join <span className="text-white font-medium">1,200+ professionals</span> getting early access to VIP parties and secret meetups.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
             <input 
                type="email" 
                placeholder="Enter your email address"
                aria-label="Email address for subscription"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none rounded-xl px-4 py-3 text-white placeholder-txt-dim focus:ring-0 focus:outline-none text-sm"
             />
             <button 
                onClick={handleSubscribe}
                className="w-full sm:w-auto bg-primary hover:bg-primaryHover text-background font-bold px-6 py-3 rounded-xl whitespace-nowrap transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-sm"
             >
                Join Now <ArrowRight size={14} />
             </button>
          </div>
          
          <p className="mt-4 text-[10px] text-txt-dim uppercase tracking-widest">No spam. Unsubscribe anytime.</p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );
};

export default Hero;
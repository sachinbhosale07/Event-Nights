import React, { useState } from 'react';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = "https://affninja.beehiiv.com/";
    const url = email ? `${baseUrl}?email=${encodeURIComponent(email)}` : baseUrl;
    window.open(url, '_blank');
  };

  return (
    <section className="w-full py-24 px-4 relative overflow-hidden bg-background">
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="group relative bg-surface border border-white/5 rounded-[2rem] p-8 md:p-16 text-center shadow-2xl overflow-hidden hover:border-white/10 transition-colors duration-500">
            
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            
            {/* Top Glow Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />

            {/* Icon */}
            <div className="flex justify-center mb-8 relative">
                <div className="w-20 h-20 bg-surfaceHighlight rounded-2xl flex items-center justify-center border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.2)] relative z-10 group-hover:scale-110 transition-transform duration-500 ease-out">
                    <Mail size={32} className="text-primary" />
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                {/* Decorative lines behind icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                Stay Ahead in <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white">
                    Affiliate & Growth Marketing
                </span>
            </h2>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-txt-muted max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Weekly insights on affiliate marketing, events, tools, and growth strategies — no spam, ever.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto relative z-20">
                <div className="relative w-full group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-dim group-focus-within/input:text-primary transition-colors">
                        <Mail size={20} />
                    </div>
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-white placeholder-txt-dim focus:border-primary/50 focus:bg-black/40 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all shadow-inner"
                        required
                    />
                </div>
                
                <button 
                    type="submit"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="bg-primary hover:bg-primaryHover text-background font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] flex items-center justify-center gap-2 whitespace-nowrap transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    Subscribe Free 
                    <ArrowRight size={18} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </button>
            </form>

            {/* Trust Micro-copy */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs font-medium text-txt-dim animate-fade-in">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Trusted by 15,000+ marketers</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-white/10 rounded-full" />
                <div className="flex items-center gap-2">
                    <span>Unsubscribe anytime</span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
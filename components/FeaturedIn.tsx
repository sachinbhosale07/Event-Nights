import React from 'react';

const LOGO_GROUPS = {
  row1: [
    "The Affiliate Summit", "Affiliate World", "Huffington Post", "Admitad", 
    "Medium", "India Today", "TES Affiliate Conferences", "SiGMA", "ClickBid World", 
    "World Summit AI", "FOREX EXPO", "Generative AI", "Blockchain Life", 
    "PROX EXPO", "Fridman Tower", "iFX EXPO"
  ],
  row2: [
    "The Martech Summit", "BigSpy", "MINEA", "ADSTERRA", "Helium 10", "Oxylabs", 
    "ADSPY", "REACH", "MULTILOGIN", "Dolphin", "Made in Abyss", "MYBID", 
    "GALAKSION", "GFLeads", "Binom", "HOSTINGER", "PointWeb", "Teachable", 
    "Chameleon", "QuantVPS", "Sell The Trend", "ADULT FORCE", "ForexVPS.net", 
    "EHunt", "DECODO", "REDTRACK", "WEBSHARE"
  ]
};

const LogoItem: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center justify-center px-8 md:px-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group">
    <span className="text-lg md:text-xl font-bold text-white whitespace-nowrap font-sans tracking-tight group-hover:text-primary transition-colors">
      {name}
    </span>
  </div>
);

const FeaturedIn: React.FC = () => {
  return (
    <section className="w-full bg-background border-b border-white/[0.06] py-12 overflow-hidden relative z-10">
      
      {/* Section Header */}
      <div className="container mx-auto px-6 mb-10 text-center">
        <h3 className="text-sm font-bold text-white mb-2 tracking-wide">Featured In</h3>
        <p className="text-xs text-txt-dim font-medium uppercase tracking-widest">
          Trusted by leading media, conferences, and platforms worldwide
        </p>
      </div>

      <div className="relative flex flex-col gap-8">
        
        {/* Gradient Masks */}
        <div className="absolute top-0 bottom-0 left-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

        {/* Row 1 */}
        <div className="flex w-max hover:pause animate-marquee group">
          {/* Original List */}
          {[...LOGO_GROUPS.row1].map((name, idx) => (
            <LogoItem key={`r1-a-${idx}`} name={name} />
          ))}
          {/* Duplicate for infinite loop */}
          {[...LOGO_GROUPS.row1].map((name, idx) => (
            <LogoItem key={`r1-b-${idx}`} name={name} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex w-max hover:pause animate-marquee-reverse group">
          {/* Original List */}
          {[...LOGO_GROUPS.row2].map((name, idx) => (
            <LogoItem key={`r2-a-${idx}`} name={name} />
          ))}
          {/* Duplicate for infinite loop */}
          {[...LOGO_GROUPS.row2].map((name, idx) => (
            <LogoItem key={`r2-b-${idx}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;
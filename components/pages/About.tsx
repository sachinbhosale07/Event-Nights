import React from 'react';
import SimpleHeader from '../SimpleHeader';
import Footer from '../Footer';
import { Users, Calendar, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-txt-main font-sans selection:bg-primary/30 selection:text-white flex flex-col">
      <SimpleHeader />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span className="text-xs font-medium text-primary uppercase tracking-wide">Our Mission</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                Connecting the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Industry</span>
            </h1>
            <p className="text-xl text-txt-muted max-w-2xl mx-auto leading-relaxed">
                We believe the most valuable business deals don't happen on the expo floor—they happen at the dinners, parties, and side-events afterwards.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-primary/30 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Calendar size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Curated Events</h3>
                <p className="text-txt-muted text-sm leading-relaxed">
                    We meticulously aggregate every networking opportunity surrounding major conferences, so you never miss out.
                </p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-primary/30 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                    <Users size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Community Driven</h3>
                <p className="text-txt-muted text-sm leading-relaxed">
                    Our platform is built by conference-goers, for conference-goers. Submit events and help the community grow.
                </p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-primary/30 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                    <Globe size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Global Reach</h3>
                <p className="text-txt-muted text-sm leading-relaxed">
                    From Las Vegas to Bangkok, we cover the most influential affiliate, tech, and marketing gatherings worldwide.
                </p>
            </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-txt-muted">
            <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
            <p className="mb-6">
                Conference Nights started as a simple shared spreadsheet between friends attending Affiliate Summit West. We realized that finding out where everyone was going for dinner or drinks was harder than it should be. 
            </p>
            <p className="mb-6">
                What began as a small list of "must-attend" parties has grown into the industry's leading directory for side-events. We are dedicated to helping professionals maximize their ROI from expensive conference trips by ensuring they are in the right rooms with the right people.
            </p>
            <p>
                Today, we serve thousands of attendees across dozens of conferences annually. Whether you are hosting a VIP dinner or looking for a casual happy hour, Conference Nights is your compass.
            </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050507] pt-20 pb-10">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                        <span className="font-bold text-primary text-sm">CN</span>
                     </div>
                     <span className="text-xl font-bold text-white tracking-tight">Conference Nights</span>
                </div>
                <p className="text-txt-dim text-sm leading-relaxed max-w-sm mb-8">
                    The ultimate directory for conference side-events, VIP dinners, and networking parties. helping you maximize your ROI at every event.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-txt-dim hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all">
                        <Twitter size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-txt-dim hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all">
                        <Linkedin size={18} />
                    </a>
                    <a href="mailto:hello@conferencenights.com" className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-txt-dim hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all">
                        <Mail size={18} />
                    </a>
                </div>
            </div>

            {/* Links Column 1 */}
            <div>
                <h4 className="text-white font-bold mb-6">Platform</h4>
                <ul className="space-y-4 text-sm text-txt-muted">
                    <li><Link to="/" className="hover:text-primary transition-colors">Browse Events</Link></li>
                    <li><Link to="/" className="hover:text-primary transition-colors">Submit an Event</Link></li>
                    <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                </ul>
            </div>

            {/* Links Column 2 */}
            <div>
                <h4 className="text-white font-bold mb-6">Legal</h4>
                <ul className="space-y-4 text-sm text-txt-muted">
                    <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                    <li><span className="cursor-pointer hover:text-primary transition-colors">Cookie Settings</span></li>
                </ul>
            </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-txt-dim">
                &copy; {new Date().getFullYear()} Conference Nights. All rights reserved.
            </div>
            
            <Link to="/admin/login" className="flex items-center gap-2 text-xs text-txt-dim/40 hover:text-primary transition-colors group">
                <Lock size={12} className="group-hover:text-primary" />
                <span>Admin Access</span>
            </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

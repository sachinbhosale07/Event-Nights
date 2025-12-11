import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 mt-20 bg-black/40 backdrop-blur-md">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 text-sm text-gray-500">
          <Link to="/about" className="hover:text-gray-300 transition">About Us</Link>
          <span className="hidden md:block w-px h-3 bg-gray-800"></span>
          <Link to="/terms" className="hover:text-gray-300 transition">Terms & Conditions</Link>
          <span className="hidden md:block w-px h-3 bg-gray-800"></span>
          <Link to="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
          <span className="hidden md:block w-px h-3 bg-gray-800"></span>
          <Link to="/admin/login" className="hover:text-purple-400 transition flex items-center gap-1.5 group">
             <ShieldCheck size={14} className="group-hover:text-purple-400 text-gray-600" />
             Admin Access
          </Link>
        </div>
        <div className="text-center text-xs text-gray-700 mt-6">
          &copy; Conference Nights {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
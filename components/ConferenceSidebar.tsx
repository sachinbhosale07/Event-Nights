import React from 'react';
import { MapPin, Calendar, Plus } from 'lucide-react';
import { Conference } from '../types';

interface ConferenceSidebarProps {
  conferences: Conference[];
  selectedConferenceId: string;
  onSelect: (id: string) => void;
  onOpenSubmitModal: () => void;
}

const ConferenceSidebar: React.FC<ConferenceSidebarProps> = ({ conferences, selectedConferenceId, onSelect, onOpenSubmitModal }) => {
  return (
    <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Conferences</h2>
          <span className="text-xs text-gray-700 bg-white/5 px-2 py-0.5 rounded-full">{conferences.length}</span>
        </div>
        
        <div className="flex flex-col gap-2">
            {conferences.map((conf) => {
                const isSelected = conf.id === selectedConferenceId;
                return (
                    <button
                        key={conf.id}
                        onClick={() => onSelect(conf.id)}
                        className={`
                            text-left p-4 rounded-xl border transition-all duration-200 group relative
                            ${isSelected 
                                ? 'bg-white/[0.03] border-purple-500/50 shadow-lg shadow-purple-900/10' 
                                : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                            }
                        `}
                    >
                        <div className={`font-bold mb-2 text-sm leading-snug transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                            {conf.name}
                        </div>
                        <div className="flex flex-col gap-1.5 text-xs text-gray-600 group-hover:text-gray-500 transition-colors">
                            <div className="flex items-center gap-2">
                                <MapPin size={12} className={isSelected ? 'text-purple-400' : ''} />
                                {conf.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={12} className={isSelected ? 'text-purple-400' : ''} />
                                {conf.dateRange}
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
      </div>

      <div className="mt-2">
        <button 
          onClick={onOpenSubmitModal}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 text-xs font-bold uppercase tracking-wide text-gray-500 hover:text-purple-400 transition-all duration-300"
        >
            <Plus size={14} /> Submit a Conference
        </button>
      </div>
    </div>
  );
};

export default ConferenceSidebar;
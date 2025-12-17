
import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar as CalendarIcon, Star, MapPin, ArrowUpRight, CalendarPlus, Clock, User, Users, Tag, Image as ImageIcon } from 'lucide-react';
import { Conference, EventItem, MonthOption } from '../types';
import { generateGoogleCalendarUrl } from '../utils';

interface EventListProps {
  conference?: Conference;
  events: EventItem[];
  onOpenSubmitEventModal: () => void;
  months: MonthOption[];
  selectedMonth: MonthOption;
  onSelectMonth: (m: MonthOption) => void;
}

const EventList: React.FC<EventListProps> = ({ 
    conference, 
    events,
    onOpenSubmitEventModal,
}) => {
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('cn_saved_events');
    if (saved) {
      try {
        setSavedEventIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to parse saved events", e);
      }
    }
  }, []);

  const toggleSave = (eventId: string) => {
    const newSaved = new Set(savedEventIds);
    if (newSaved.has(eventId)) {
      newSaved.delete(eventId);
    } else {
      newSaved.add(eventId);
    }
    setSavedEventIds(newSaved);
    localStorage.setItem('cn_saved_events', JSON.stringify(Array.from(newSaved)));
  };

  if (!conference) {
      return (
          <div className="flex-1 min-w-0 bg-surface border border-white/5 rounded-3xl p-20 text-center flex flex-col items-center justify-center shadow-lg animate-fade-in-up">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                 <CalendarIcon size={32} className="text-txt-dim opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Select a Conference</h3>
              <p className="text-txt-muted max-w-sm text-sm">Choose a conference from the sidebar to view the official schedule and side-events.</p>
          </div>
      );
  }

  // Group events by date
  const groupedEvents: Record<string, EventItem[]> = {};
  events.forEach(event => {
    if (!groupedEvents[event.date]) {
        groupedEvents[event.date] = [];
    }
    groupedEvents[event.date].push(event);
  });

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-10 animate-fade-in-up pb-20">
      
      {/* Conference Header Card */}
      <div className="bg-surface border border-white/5 rounded-3xl p-8 md:p-10 relative overflow-hidden group shadow-2xl">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6 leading-[1.1]">{conference.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-white/90">
                            <MapPin size={16} className="text-primary" /> 
                            <span className="font-medium">{conference.location}</span>
                        </span>
                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-white/90">
                            <CalendarIcon size={16} className="text-primary" /> 
                            <span className="font-medium">{conference.dateRange}, {conference.year}</span>
                        </span>
                    </div>
                </div>
                
                {conference.websiteUrl && (
                    <a href={conference.websiteUrl} target="_blank" rel="noreferrer" className="shrink-0 flex items-center gap-2 text-xs font-bold text-background bg-primary hover:bg-primaryHover px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                        Official Website <ArrowUpRight size={14} />
                    </a>
                )}
            </div>
            
            <p className="text-txt-muted text-lg font-light leading-relaxed max-w-3xl border-t border-white/5 pt-6">
                {conference.description}
            </p>
         </div>
      </div>

      {/* Visual Divider */}
      <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-txt-dim px-2">
          <div className="h-px bg-white/10 flex-1"></div>
          <span>Event Schedule</span>
          <div className="h-px bg-white/10 flex-1"></div>
      </div>

      {/* Timeline Event Container */}
      <div className="relative">
        
        {sortedDates.length > 0 ? (
            <div className="space-y-16">
                {sortedDates.map((date, dateIndex) => {
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                    const dateNum = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
                    
                    return (
                        <div key={date} className="relative">
                            
                            {/* Sticky Date Header */}
                            <div className="sticky top-[88px] z-30 mb-8 flex items-center gap-4 bg-background/95 backdrop-blur-sm py-2 -mx-2 px-2 rounded-xl border border-transparent">
                                <div className="h-12 w-12 rounded-xl bg-surfaceHighlight border border-white/10 flex flex-col items-center justify-center shadow-glass shrink-0">
                                    <span className="text-[10px] uppercase text-primary font-bold leading-none mb-0.5">{dateObj.toLocaleString('en-US', { month: 'short' })}</span>
                                    <span className="text-lg font-bold text-white leading-none">{dateObj.getDate()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold text-white tracking-tight">{dayName}</h3>
                                    <span className="text-xs text-txt-dim uppercase tracking-wider">{dateNum}</span>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
                            </div>

                            {/* Events for this date */}
                            <div className="relative ml-6 md:ml-[5.5rem] border-l border-white/10 space-y-6 pb-4">
                                
                                {groupedEvents[date].map((event, idx) => {
                                    const isSaved = savedEventIds.has(event.id);
                                    const calendarUrl = generateGoogleCalendarUrl(event);
                                    
                                    return (
                                        <div key={event.id} className="relative pl-8 md:pl-10 group">
                                            
                                            {/* Timeline Node */}
                                            <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-surface border-2 border-primary ring-4 ring-background z-10 shadow-[0_0_10px_rgba(45,212,191,0.5)] group-hover:scale-125 transition-transform duration-300"></div>

                                            {/* Time Label (Desktop Absolute) */}
                                            <div className="hidden md:flex flex-col absolute -left-[7rem] top-7 w-24 items-end">
                                                <span className="font-mono text-sm font-bold text-primary tabular-nums opacity-80 group-hover:opacity-100 transition-opacity">{event.startTime}</span>
                                                {event.endTime && (
                                                    <span className="font-mono text-[10px] text-txt-dim tabular-nums mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        {event.endTime}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Event Card */}
                                            <div className="relative bg-surface border border-white/5 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all duration-300 shadow-sm group-hover:shadow-glow group-hover:-translate-y-1 overflow-hidden">
                                                
                                                {/* Mobile Time Pill */}
                                                <div className="md:hidden mb-4">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                                                        <Clock size={12} /> {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                                                    </span>
                                                </div>

                                                {/* Event Image */}
                                                {event.image && (
                                                    <div className="mb-6 rounded-xl overflow-hidden h-48 md:h-64 w-full relative border border-white/5 bg-surfaceHighlight">
                                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                    </div>
                                                )}

                                                {/* Header: Title & Badges */}
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-primary transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                                                        {event.tags?.includes('VIP') && (
                                                            <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.15)] backdrop-blur-md">
                                                                VIP Access
                                                            </span>
                                                        )}
                                                        {event.tags?.includes('Party') && (
                                                            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                                                                Party
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Body: Description & Metadata */}
                                                <div className="mb-8">
                                                    <p className="text-txt-muted text-sm leading-relaxed mb-6">
                                                        {event.description}
                                                    </p>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm p-4 rounded-xl bg-white/[0.02] border border-white/[0.02]">
                                                        {/* Host */}
                                                        <div className="flex items-center gap-3 text-txt-dim group-hover:text-txt-main transition-colors">
                                                            <User size={16} className="text-primary/70 shrink-0" />
                                                            <span className="truncate">Hosted by <span className="font-semibold text-white">{event.host}</span></span>
                                                        </div>
                                                        
                                                        {/* Location */}
                                                        <div className="flex items-center gap-3 text-txt-dim group-hover:text-txt-main transition-colors">
                                                            <MapPin size={16} className="text-primary/70 shrink-0" />
                                                            <div className="flex flex-col leading-none">
                                                                <span className="font-medium text-white">{event.locationName}</span>
                                                                {event.locationAddress && <span className="text-[10px] text-txt-dim mt-1">{event.locationAddress}</span>}
                                                            </div>
                                                        </div>

                                                        {/* Capacity */}
                                                        {event.capacity && (
                                                            <div className="flex items-center gap-3 text-txt-dim group-hover:text-txt-main transition-colors">
                                                                <Users size={16} className="text-primary/70 shrink-0" />
                                                                <span className="truncate">Capacity: <span className="font-semibold text-white">{event.capacity}</span></span>
                                                            </div>
                                                        )}

                                                        {/* Category */}
                                                        {event.category && (
                                                            <div className="flex items-center gap-3 text-txt-dim group-hover:text-txt-main transition-colors">
                                                                <Tag size={16} className="text-primary/70 shrink-0" />
                                                                <span className="truncate">Category: <span className="font-semibold text-white">{event.category}</span></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Footer: Actions */}
                                                <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            onClick={() => toggleSave(event.id)}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                                                isSaved 
                                                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                                                                : 'bg-white/5 border-white/5 text-txt-muted hover:text-white hover:bg-white/10'
                                                            }`}
                                                        >
                                                            <Star size={14} fill={isSaved ? "currentColor" : "none"} />
                                                            {isSaved ? 'Saved' : 'Save'}
                                                        </button>

                                                        <a 
                                                            href={calendarUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/5 text-txt-muted hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            <CalendarPlus size={14} /> Add to Cal
                                                        </a>
                                                    </div>

                                                    <a 
                                                        href={event.registrationUrl || event.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                                                            !event.registrationUrl && !event.link 
                                                            ? 'opacity-50 pointer-events-none bg-white/5 text-txt-dim' 
                                                            : 'bg-primary hover:bg-primaryHover text-background shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5'
                                                        }`}
                                                    >
                                                        Register <ArrowUpRight size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center bg-surface border border-white/5 rounded-3xl relative overflow-hidden group transition-colors hover:border-white/10">
                 {/* Decorative background */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6 border border-white/5 shadow-inner relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <CalendarIcon size={32} className="text-txt-dim opacity-50" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3 relative z-10">No events scheduled yet</h4>
                <p className="max-w-xs mx-auto text-sm text-txt-muted leading-relaxed mb-8 text-center relative z-10">
                    Be the first to list an event for <span className="text-white font-medium">{conference.name}</span>.
                </p>
                <button 
                    onClick={onOpenSubmitEventModal}
                    className="relative z-10 bg-primary hover:bg-primaryHover text-background text-sm font-bold flex items-center gap-2 px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                    Submit an Event <ArrowUpRight size={16} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default EventList;

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ExternalLink, Star, ArrowUpRight, Clock, Plus, CalendarPlus } from 'lucide-react';
import { Conference, EventItem } from '../types';

interface EventListProps {
  conference: Conference;
  events: EventItem[];
  onOpenSubmitEventModal: () => void;
}

const EventList: React.FC<EventListProps> = ({ conference, events, onOpenSubmitEventModal }) => {
  // State for saved events
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>(new Set());

  // Load saved events from localStorage on mount
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

  // Group events by date
  const groupedEvents: Record<string, EventItem[]> = {};
  events.forEach(event => {
    if (!groupedEvents[event.date]) {
        groupedEvents[event.date] = [];
    }
    groupedEvents[event.date].push(event);
  });

  const sortedDates = Object.keys(groupedEvents).sort();

  const getGoogleCalendarUrl = (event: EventItem) => {
    const parseTime = (dateStr: string, timeStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        
        let hours = 0;
        let minutes = 0;
        
        // Normalize input
        const timeLower = timeStr.toLowerCase();
        const isPM = timeLower.includes('pm');
        const isAM = timeLower.includes('am');
        
        // Remove text to get numbers
        const cleanTime = timeLower.replace('am', '').replace('pm', '').trim();
        const parts = cleanTime.split(':');
        
        if (parts.length >= 2) {
            hours = parseInt(parts[0], 10);
            minutes = parseInt(parts[1], 10);
        } else if (parts.length === 1) {
             hours = parseInt(parts[0], 10);
        }

        if (isPM && hours < 12) hours += 12;
        if (isAM && hours === 12) hours = 0;

        return new Date(year, month - 1, day, hours, minutes);
    };

    try {
        const startDate = parseTime(event.date, event.startTime);
        let endDate: Date;
        
        if (event.endTime) {
            endDate = parseTime(event.date, event.endTime);
            // Handle overnight events (end time < start time implies next day)
            if (endDate < startDate) {
                endDate.setDate(endDate.getDate() + 1);
            }
        } else {
            // Default to 1 hour duration if no end time specified
            endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        }

        // Format as YYYYMMDDTHHMMSS (Floating time - uses user's calendar timezone)
        const formatFloating = (date: Date) => {
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
        };

        const startStr = formatFloating(startDate);
        const endStr = formatFloating(endDate);

        const details = encodeURIComponent(`${event.description}\n\nHost: ${event.host}\nLink: ${event.registrationUrl || 'N/A'}`);
        const location = encodeURIComponent(`${event.venueName}${event.locationName && event.locationName !== event.venueName ? `, ${event.locationName}` : ''}`);
        const title = encodeURIComponent(event.title);

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
    } catch (e) {
        console.error("Error generating calendar link", e);
        return "#";
    }
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Header Info */}
      <div className="mb-8 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent p-6 md:p-8 rounded-2xl border border-white/5">
        <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 mb-4">
            {conference.name}
            <a 
                href="#" 
                className="opacity-50 hover:opacity-100 transition-opacity"
                title="Visit Website"
            >
                <ExternalLink size={20} />
            </a>
            </h2>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6 items-center">
                <div className="flex items-center gap-2 text-gray-300">
                    <MapPin size={16} className="text-purple-500" />
                    {conference.location}
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <div className="flex items-center gap-2 text-gray-300">
                    <Calendar size={16} className="text-pink-500" />
                    {conference.dateRange}
                </div>
            </div>
            
            <p className="text-gray-400 max-w-3xl leading-relaxed text-sm">
            {conference.description}
            </p>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-surfaceHighlight/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Table Headers - Inside container for perfect alignment */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 bg-white/[0.01]">
            <div className="col-span-2">Time</div>
            <div className="col-span-4">Event Details</div>
            <div className="col-span-2">Host</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-1">Cap.</div>
            <div className="col-span-1 text-right">Action</div>
        </div>

        {sortedDates.map((date) => {
            const dateObj = new Date(date);
            const dateString = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            
            return (
                <div key={date}>
                    {/* Date Header */}
                    <div className="bg-white/[0.05] px-6 py-3 border-y border-white/5 first:border-t-0 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">{dateString}</h3>
                    </div>

                    {groupedEvents[date].map((event) => {
                         return (
                            <div key={event.id} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-b-0">
                                <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    
                                    {/* Time */}
                                    <div className="md:col-span-2 flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-1">
                                        <div className="flex items-center gap-2">
                                            <div className="text-white font-bold text-sm md:text-base bg-white/5 px-2 py-1 rounded-md border border-white/5 md:bg-transparent md:border-0 md:p-0 md:rounded-none">
                                                {event.startTime}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="md:col-span-4 pr-2">
                                        <div className="text-white font-bold text-base mb-1 group-hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-2">
                                            {event.title}
                                            {/* Tag example */}
                                            {event.tags && event.tags.includes('VIP') && (
                                                <span className="text-[10px] bg-yellow-500/20 text-yellow-200 px-1.5 py-0.5 rounded border border-yellow-500/30 font-bold uppercase">VIP</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 leading-relaxed line-clamp-2 group-hover:text-gray-400">
                                            {event.description}
                                        </div>
                                    </div>

                                    {/* Host */}
                                    <div className="md:col-span-2 mt-2 md:mt-0">
                                        <div className="md:hidden text-[10px] text-gray-600 uppercase font-bold mb-1">Host</div>
                                        <div className="text-xs md:text-sm text-gray-400 font-medium">
                                            {event.host}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="md:col-span-2 mt-2 md:mt-0">
                                        <div className="md:hidden text-[10px] text-gray-600 uppercase font-bold mb-1">Location</div>
                                        <div className="text-xs md:text-sm text-gray-400 truncate pr-2 flex items-center gap-1.5" title={event.locationName}>
                                            <MapPin size={12} className="text-gray-600" />
                                            {event.locationName}
                                        </div>
                                    </div>

                                    {/* Capacity & Actions Wrapper */}
                                    {/* Mobile: Flex Row. Desktop: Grid Columns 2 to match header columns 11 & 12 */}
                                    <div className="col-span-1 md:col-span-2 mt-3 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-0 flex items-center justify-between md:grid md:grid-cols-2 md:gap-4">
                                         
                                         {/* Capacity */}
                                         <div className="md:col-span-1">
                                            <div className="md:hidden text-[10px] text-gray-600 uppercase font-bold mb-1">Cap.</div>
                                            <div className="text-xs md:text-sm text-gray-500 font-medium md:text-left">
                                                {event.capacity ? `${event.capacity}` : '-'}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="md:col-span-1 flex justify-end gap-1 text-gray-500">
                                            <button 
                                                onClick={() => toggleSave(event.id)}
                                                className={`p-2 rounded-lg transition-colors ${savedEventIds.has(event.id) ? 'text-yellow-400 hover:text-yellow-300 hover:bg-white/10' : 'hover:bg-white/10 hover:text-white'}`}
                                                title={savedEventIds.has(event.id) ? "Unsave Event" : "Save Event"}
                                            >
                                                <Star size={16} fill={savedEventIds.has(event.id) ? "currentColor" : "none"} />
                                            </button>
                                            
                                            <a 
                                                href={getGoogleCalendarUrl(event)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                                                title="Add to Google Calendar"
                                            >
                                                <CalendarPlus size={16} />
                                            </a>

                                            {event.link ? (
                                                <a 
                                                    href={event.link} 
                                                    target="_blank"
                                                    rel="noopener noreferrer" 
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5 hover:border-white/20" 
                                                    title="Visit Event Website"
                                                >
                                                    <ArrowUpRight size={16} />
                                                </a>
                                            ) : (
                                                <button disabled className="p-2 rounded-lg bg-white/5 text-gray-700 border border-white/5 cursor-not-allowed" title="No Link Available">
                                                    <ArrowUpRight size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                         );
                    })}
                </div>
            );
        })}
        
        {sortedDates.length === 0 && (
             <div className="py-24 text-center flex flex-col items-center justify-center bg-transparent">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
                    <Calendar size={24} className="text-gray-600" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">No events found</h3>
                <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
                    Be the first to add an event for this conference.
                </p>
                <button 
                  onClick={onOpenSubmitEventModal}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2"
                >
                    <Plus size={16} /> List Event
                </button>
             </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
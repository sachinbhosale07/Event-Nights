import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchConferenceById, fetchEventsByConference, deleteEvent } from '../../services/db';
import { Conference, EventItem } from '../../types';
import { ArrowLeft, Calendar, MapPin, Globe, Plus, Edit2, Trash2, Loader2, ExternalLink } from 'lucide-react';
import EventsManager from './EventsManager'; // Reuse logic if possible, but we'll likely build a custom list here for clarity

const ConferenceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [conference, setConference] = useState<Conference | undefined>(undefined);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // We reuse the modal state logic roughly, or simply link to EventsManager with pre-filled state?
  // For better UX, we'll keep it self-contained or use a simplified listing.
  
  useEffect(() => {
    if (id) {
        loadData(id);
    }
  }, [id]);

  const loadData = async (confId: string) => {
    setLoading(true);
    try {
        const [conf, eventsData] = await Promise.all([
            fetchConferenceById(confId),
            fetchEventsByConference(confId)
        ]);
        if (!conf) {
            navigate('/admin/conferences');
            return;
        }
        setConference(conf);
        setEvents(eventsData);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
      if(confirm('Delete this event?')) {
          await deleteEvent(eventId);
          if (id) loadData(id);
      }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;
  if (!conference) return <div>Conference not found</div>;

  return (
    <div className="space-y-8">
      {/* Header / Nav */}
      <div>
          <Link to="/admin/conferences" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={16} /> Back to Conferences
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{conference.name}</h1>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${conference.status === 'Published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                        {conference.status}
                    </span>
                </div>
                <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-purple-400" />
                        {conference.startDate} to {conference.endDate} ({conference.year})
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-purple-400" />
                        {conference.location}
                    </div>
                    {conference.websiteUrl && (
                        <a href={conference.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                            <Globe size={14} /> Website <ExternalLink size={10} />
                        </a>
                    )}
                </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
                 <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Edit2 size={16} /> Edit Details
                 </button>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Events List */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Events Schedule</h2>
                  <Link 
                    to="/admin/events" 
                    className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    // In a real app, passing state to pre-select conference in the modal
                  >
                    <Plus size={16} /> Add Event
                  </Link>
              </div>

              <div className="bg-surfaceHighlight border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase text-xs font-bold">
                    <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Date/Time</th>
                        <th className="px-6 py-4">Venue</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {events.length > 0 ? events.map((event) => (
                        <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                        <td className="px-6 py-4">
                            <div>{event.date}</div>
                            <div className="text-xs text-gray-600">{event.startTime}</div>
                        </td>
                        <td className="px-6 py-4">{event.venueName}</td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg" title="Edit">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg" title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                No events found for this conference.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
              </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
               <div className="bg-surfaceHighlight border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Description</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {conference.description}
                    </p>
               </div>
               
               {conference.bannerImage && (
                   <div className="rounded-xl overflow-hidden border border-white/5">
                       <img src={conference.bannerImage} alt="Conference Banner" className="w-full h-auto object-cover" />
                   </div>
               )}
          </div>
      </div>
    </div>
  );
};

export default ConferenceDetails;

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  fetchConferenceById, 
  fetchEventsByConference, 
  deleteEvent, 
  updateEvent, 
  createEvent,
  updateConference,
  fetchConferences
} from '../../services/db';
import { Conference, EventItem } from '../../types';
import { ArrowLeft, Calendar, MapPin, Globe, Plus, Edit2, Trash2, Loader2, ExternalLink, X, Save, Send, Image, AlertTriangle } from 'lucide-react';

const ConferenceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [conference, setConference] = useState<Conference | undefined>(undefined);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [allConferences, setAllConferences] = useState<Conference[]>([]); // For linking if needed
  const [loading, setLoading] = useState(true);

  // Modal State - Event
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventFormData, setEventFormData] = useState<Partial<EventItem>>({});

  // Modal State - Conference
  const [isConfModalOpen, setIsConfModalOpen] = useState(false);
  const [confFormData, setConfFormData] = useState<Partial<Conference>>({});

  // Delete Confirmation State
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
        loadData(id);
    }
  }, [id]);

  const loadData = async (confId: string) => {
    setLoading(true);
    try {
        const [conf, eventsData, confsList] = await Promise.all([
            fetchConferenceById(confId),
            fetchEventsByConference(confId),
            fetchConferences()
        ]);
        if (!conf) {
            navigate('/admin/conferences');
            return;
        }
        setConference(conf);
        setEvents(eventsData);
        setAllConferences(confsList);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  // --- Event Handling ---
  const handleOpenEventModal = (event?: EventItem) => {
    if (event) {
      setEditingEvent(event);
      setEventFormData(event);
    } else {
      setEditingEvent(null);
      setEventFormData({
        title: '',
        date: conference?.startDate || new Date().toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '',
        description: '',
        host: '',
        venueName: conference?.location?.split(',')[0] || '',
        locationAddress: '',
        conferenceId: conference?.id,
        registrationUrl: '',
        image: '',
        status: 'Draft'
      });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (status: 'Draft' | 'Published') => {
    try {
      const finalData = { ...eventFormData, status };
      
      if (editingEvent) {
        await updateEvent(editingEvent.id, finalData);
      } else {
        await createEvent(finalData as Omit<EventItem, 'id'>);
      }
      setIsEventModalOpen(false);
      if (id) loadData(id);
    } catch (error) {
      alert("Error saving event");
    }
  };

  const confirmDeleteEvent = async () => {
      if(deleteEventId) {
          await deleteEvent(deleteEventId);
          setDeleteEventId(null);
          if (id) loadData(id);
      }
  };

  // --- Conference Handling ---
  const handleOpenConfModal = () => {
    if (!conference) return;
    setConfFormData(conference);
    setIsConfModalOpen(true);
  };

  const handleSaveConference = async () => {
      if (!conference || !id) return;
      try {
          // Recalculate derived fields if dates changed
          let derivedUpdates = {};
          if (confFormData.startDate && confFormData.endDate) {
             const start = new Date(confFormData.startDate);
             const end = new Date(confFormData.endDate);
             const m = start.toLocaleString('en-US', { month: 'short' });
             const dRange = `${m} ${start.getDate()} - ${m} ${end.getDate()}`;
             derivedUpdates = {
                 month: m,
                 year: start.getFullYear(),
                 dateRange: dRange
             };
          }

          await updateConference(id, { ...confFormData, ...derivedUpdates });
          setIsConfModalOpen(false);
          loadData(id);
      } catch (e) {
          alert("Error updating conference");
      }
  };


  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!conference) return <div>Conference not found</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Nav */}
      <div>
          <Link to="/admin/conferences" className="inline-flex items-center gap-2 text-txt-muted hover:text-white mb-4 transition-colors">
              <ArrowLeft size={16} /> Back to Conferences
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{conference.name}</h1>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${conference.status === 'Published' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-white/5 text-txt-muted border-white/10'}`}>
                        {conference.status}
                    </span>
                </div>
                <div className="flex flex-wrap gap-4 text-txt-muted text-sm">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-primary" />
                        {conference.startDate} to {conference.endDate} ({conference.year})
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-primary" />
                        {conference.location}
                    </div>
                    {conference.websiteUrl && (
                        <a href={conference.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <Globe size={14} /> Website <ExternalLink size={10} />
                        </a>
                    )}
                </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
                 <button 
                    onClick={handleOpenConfModal}
                    className="px-4 py-2 rounded-lg bg-surface border border-white/10 text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                 >
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
                  <button 
                    onClick={() => handleOpenEventModal()}
                    className="text-sm bg-primary hover:bg-primaryHover text-background px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                  >
                    <Plus size={16} /> Add Event
                  </button>
              </div>

              <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-txt-muted">
                    <thead className="bg-white/[0.02] text-txt-dim uppercase text-xs font-bold">
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
                            <div className="text-xs text-txt-dim">{event.startTime}</div>
                        </td>
                        <td className="px-6 py-4">{event.venueName}</td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleOpenEventModal(event)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg" title="Edit">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => setDeleteEventId(event.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg" title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-txt-dim">
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
               <div className="bg-surface border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Description</h3>
                    <p className="text-txt-muted text-sm leading-relaxed whitespace-pre-wrap">
                        {conference.description}
                    </p>
               </div>
               
               {conference.bannerImage && (
                   <div className="rounded-xl overflow-hidden border border-white/5 relative group">
                       <img src={conference.bannerImage} alt="Conference Banner" className="w-full h-auto object-cover" />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button onClick={handleOpenConfModal} className="text-white flex items-center gap-2 font-bold"><Image size={16} /> Change Image</button>
                       </div>
                   </div>
               )}
          </div>
      </div>

       {/* Delete Confirmation Modal */}
       {deleteEventId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Delete Event?</h3>
                    <p className="text-sm text-txt-muted">This action cannot be undone. The event will be permanently removed.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setDeleteEventId(null)}
                        className="flex-1 px-4 py-2 rounded-lg text-txt-dim hover:text-white font-medium hover:bg-white/5 transition-colors border border-transparent"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDeleteEvent}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- EVENT MODAL --- */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
                    <button onClick={() => setIsEventModalOpen(false)} className="text-txt-dim hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Event Title</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={eventFormData.title}
                            onChange={e => setEventFormData({...eventFormData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Host</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={eventFormData.host}
                                onChange={e => setEventFormData({...eventFormData, host: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Linked Conference</label>
                            <select 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={eventFormData.conferenceId || ''}
                                onChange={e => setEventFormData({...eventFormData, conferenceId: e.target.value})}
                            >
                                <option value="">None (Independent)</option>
                                {allConferences.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Date</label>
                            <input 
                                required
                                type="date" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={eventFormData.date}
                                onChange={e => setEventFormData({...eventFormData, date: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Start Time</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={eventFormData.startTime}
                                onChange={e => setEventFormData({...eventFormData, startTime: e.target.value})}
                                placeholder="10:00 AM"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">End Time</label>
                            <input 
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={eventFormData.endTime || ''}
                                onChange={e => setEventFormData({...eventFormData, endTime: e.target.value})}
                                placeholder="12:00 PM"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Venue Name</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={eventFormData.venueName}
                                onChange={e => setEventFormData({...eventFormData, venueName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Capacity</label>
                            <input 
                                type="number" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={eventFormData.capacity || ''}
                                onChange={e => setEventFormData({...eventFormData, capacity: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Address (Optional)</label>
                        <input 
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={eventFormData.locationAddress || ''}
                            onChange={e => setEventFormData({...eventFormData, locationAddress: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Description</label>
                        <textarea 
                            rows={3}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={eventFormData.description}
                            onChange={e => setEventFormData({...eventFormData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Registration URL</label>
                            <input 
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={eventFormData.registrationUrl || ''}
                                onChange={e => setEventFormData({...eventFormData, registrationUrl: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center gap-3 border-t border-white/10">
                        <button 
                            type="button"
                            onClick={() => setIsEventModalOpen(false)}
                            className="px-4 py-2 rounded-lg text-txt-muted hover:text-white font-medium hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => handleSaveEvent('Draft')}
                                className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-txt-muted px-4 py-2 rounded-lg font-bold transition-colors"
                            >
                                <Save size={16} /> Save as Draft
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleSaveEvent('Published')}
                                className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-background px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-primary/20"
                            >
                                <Send size={16} /> {eventFormData.status === 'Published' ? 'Update & Publish' : 'Publish Event'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- CONFERENCE MODAL --- */}
      {isConfModalOpen && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Edit Conference</h2>
                    <button onClick={() => setIsConfModalOpen(false)} className="text-txt-dim hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Conference Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={confFormData.name}
                            onChange={e => setConfFormData({...confFormData, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">City</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={confFormData.city}
                                onChange={e => setConfFormData({...confFormData, city: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Country</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={confFormData.country}
                                onChange={e => setConfFormData({...confFormData, country: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Start Date</label>
                            <input 
                                type="date" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={confFormData.startDate}
                                onChange={e => setConfFormData({...confFormData, startDate: e.target.value})}
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">End Date</label>
                            <input 
                                type="date" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={confFormData.endDate}
                                onChange={e => setConfFormData({...confFormData, endDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Description</label>
                        <textarea 
                            rows={4}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={confFormData.description}
                            onChange={e => setConfFormData({...confFormData, description: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Banner Image URL</label>
                        <input 
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={confFormData.bannerImage || ''}
                            onChange={e => setConfFormData({...confFormData, bannerImage: e.target.value})}
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                         <button 
                                type="button"
                                onClick={handleSaveConference}
                                className="bg-primary hover:bg-primaryHover text-background px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-primary/20"
                            >
                                Save Changes
                        </button>
                    </div>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default ConferenceDetails;

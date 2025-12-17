
import React, { useState, useEffect } from 'react';
import { 
  fetchAllEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  fetchConferences 
} from '../../services/db';
import { EventItem, Conference } from '../../types';
import { Plus, Edit2, Trash2, Search, X, Filter, Loader2, Save, Send, AlertTriangle } from 'lucide-react';

const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState<Partial<EventItem>>({});

  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsData, confsData] = await Promise.all([
        fetchAllEvents(),
        fetchConferences()
      ]);
      setEvents(eventsData);
      setConferences(confsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event?: EventItem) => {
    if (event) {
      setEditingEvent(event);
      setFormData(event);
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '',
        description: '',
        host: '',
        venueName: '',
        locationAddress: '',
        conferenceId: '',
        registrationUrl: '',
        image: '',
        status: 'Draft'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    try {
      const finalData = { ...formData, status };
      if (!finalData.conferenceId) delete finalData.conferenceId;

      if (editingEvent) {
        await updateEvent(editingEvent.id, finalData);
      } else {
        await createEvent(finalData as Omit<EventItem, 'id'>);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("Error saving event");
    }
  };

  const onSaveClick = (status: 'Draft' | 'Published') => {
      const form = document.getElementById('event-form') as HTMLFormElement;
      if (form && !form.checkValidity()) {
          form.reportValidity();
          return;
      }
      handleSave(status);
  };

  const confirmDelete = async () => {
    if (deleteId) {
        await deleteEvent(deleteId);
        setDeleteId(null);
        loadData();
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.host.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-white mb-1">All Events</h1>
           <p className="text-txt-dim text-sm">Manage all side-events, independent or conference-linked.</p>
        </div>
        <button 
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primaryHover text-background px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
        >
            <Plus size={18} /> Add Event
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-dim" />
            <input 
                type="text" 
                placeholder="Search events by title or host..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-primary/50 focus:outline-none placeholder-txt-dim"
            />
        </div>
        <button className="bg-surface border border-white/10 text-txt-muted px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors">
            <Filter size={18} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
           <div className="p-8 flex justify-center text-primary"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-txt-muted">
                <thead className="bg-white/[0.02] text-txt-dim uppercase text-xs font-bold">
                <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Host</th>
                    <th className="px-6 py-4">Conference</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {filteredEvents.map((event) => {
                    const conf = conferences.find(c => c.id === event.conferenceId);
                    return (
                        <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                        <td className="px-6 py-4">
                            <div>{event.date}</div>
                            <div className="text-xs text-txt-dim">{event.startTime} - {event.endTime}</div>
                        </td>
                        <td className="px-6 py-4">{event.host}</td>
                        <td className="px-6 py-4">
                            {conf ? (
                                <span className="text-primary text-xs">{conf.name}</span>
                            ) : (
                                <span className="text-txt-dim text-xs italic">Independent</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${event.status === 'Published' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-white/5 text-txt-muted border-white/10'}`}>
                                {event.status || 'Draft'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleOpenModal(event)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg" title="Edit">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => setDeleteId(event.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg" title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
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
                        onClick={() => setDeleteId(null)}
                        className="flex-1 px-4 py-2 rounded-lg text-txt-dim hover:text-white font-medium hover:bg-white/5 transition-colors border border-transparent"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-txt-dim hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <form id="event-form" className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Event Title</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Host</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.host}
                                onChange={e => setFormData({...formData, host: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Linked Conference</label>
                            <select 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.conferenceId || ''}
                                onChange={e => setFormData({...formData, conferenceId: e.target.value})}
                            >
                                <option value="">None (Independent)</option>
                                {conferences.map(c => (
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
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Start Time</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.startTime}
                                onChange={e => setFormData({...formData, startTime: e.target.value})}
                                placeholder="10:00 AM"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">End Time</label>
                            <input 
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.endTime || ''}
                                onChange={e => setFormData({...formData, endTime: e.target.value})}
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
                                value={formData.venueName}
                                onChange={e => setFormData({...formData, venueName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Capacity</label>
                            <input 
                                type="number" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.capacity || ''}
                                onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Address (Optional)</label>
                        <input 
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={formData.locationAddress || ''}
                            onChange={e => setFormData({...formData, locationAddress: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Description</label>
                        <textarea 
                            rows={3}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Registration URL</label>
                            <input 
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.registrationUrl || ''}
                                onChange={e => setFormData({...formData, registrationUrl: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center gap-3 border-t border-white/10">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded-lg text-txt-muted hover:text-white font-medium hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => onSaveClick('Draft')}
                                className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-txt-muted px-4 py-2 rounded-lg font-bold transition-colors"
                            >
                                <Save size={16} /> Save as Draft
                            </button>
                            <button 
                                type="button"
                                onClick={() => onSaveClick('Published')}
                                className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-background px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-primary/20"
                            >
                                <Send size={16} /> {formData.status === 'Published' ? 'Update & Publish' : 'Publish Event'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;

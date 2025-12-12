import React, { useState, useEffect } from 'react';
import { 
  fetchAllEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  fetchConferences 
} from '../../services/db';
import { EventItem, Conference } from '../../types';
import { Plus, Edit2, Trash2, Search, X, Filter, Loader2, Save, Send } from 'lucide-react';

const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState<Partial<EventItem>>({});

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
        conferenceId: '', // Default to none (Independent)
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
      // If conferenceId is empty string, make it undefined
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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
        await deleteEvent(id);
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
           <p className="text-gray-500 text-sm">Manage all side-events, independent or conference-linked.</p>
        </div>
        <button 
            onClick={() => handleOpenModal()}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
            <Plus size={18} /> Add Event
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
                type="text" 
                placeholder="Search events by title or host..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surfaceHighlight border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
        </div>
        <button className="bg-surfaceHighlight border border-white/10 text-gray-300 px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors">
            <Filter size={18} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-surfaceHighlight border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
           <div className="p-8 flex justify-center text-purple-500"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 text-gray-200 uppercase text-xs font-bold">
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
                            <div className="text-xs text-gray-600">{event.startTime} - {event.endTime}</div>
                        </td>
                        <td className="px-6 py-4">{event.host}</td>
                        <td className="px-6 py-4">
                            {conf ? (
                                <span className="text-purple-400 text-xs">{conf.name}</span>
                            ) : (
                                <span className="text-gray-600 text-xs italic">Independent</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${event.status === 'Published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                                {event.status || 'Draft'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleOpenModal(event)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg" title="Edit">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(event.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg" title="Delete">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <form id="event-form" className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Event Title</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Host</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.host}
                                onChange={e => setFormData({...formData, host: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Linked Conference</label>
                            <select 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
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
                            <label className="text-sm font-medium text-gray-400">Date</label>
                            <input 
                                required
                                type="date" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Start Time</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.startTime}
                                onChange={e => setFormData({...formData, startTime: e.target.value})}
                                placeholder="10:00 AM"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">End Time</label>
                            <input 
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.endTime || ''}
                                onChange={e => setFormData({...formData, endTime: e.target.value})}
                                placeholder="12:00 PM"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Venue Name</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.venueName}
                                onChange={e => setFormData({...formData, venueName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Capacity</label>
                            <input 
                                type="number" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.capacity || ''}
                                onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Description</label>
                        <textarea 
                            rows={3}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Registration URL</label>
                            <input 
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.registrationUrl || ''}
                                onChange={e => setFormData({...formData, registrationUrl: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center gap-3 border-t border-white/10">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white font-medium hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => onSaveClick('Draft')}
                                className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-gray-300 px-4 py-2 rounded-lg font-bold transition-colors"
                            >
                                <Save size={16} /> Save as Draft
                            </button>
                            <button 
                                type="button"
                                onClick={() => onSaveClick('Published')}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-purple-900/20"
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchConferences, 
  createConference, 
  updateConference, 
  deleteConference 
} from '../../services/db';
import { Conference } from '../../types';
import { Plus, Edit2, Trash2, Search, X, Loader2, Eye, Save, Send } from 'lucide-react';
import { MONTHS } from '../../constants';

const ConferencesManager: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Conference>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchConferences();
      setConferences(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (conf?: Conference) => {
    if (conf) {
      setEditingId(conf.id);
      setFormData(conf);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        city: '',
        country: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        websiteUrl: '',
        bannerImage: '',
        status: 'Draft',
        month: MONTHS[0].label.split(' ')[0],
        year: 2026
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    try {
      const derivedLocation = `${formData.city}, ${formData.country}`;
      const startDateObj = new Date(formData.startDate || '');
      const endDateObj = new Date(formData.endDate || '');
      const shortMonth = startDateObj.toLocaleString('en-US', { month: 'short' });
      const year = startDateObj.getFullYear();
      const dateRange = `${shortMonth} ${startDateObj.getDate()} - ${shortMonth} ${endDateObj.getDate()}`;

      const finalData = {
          ...formData,
          location: derivedLocation,
          month: shortMonth,
          year: year,
          dateRange: dateRange,
          status: status
      };

      if (editingId) {
        await updateConference(editingId, finalData);
      } else {
        await createConference(finalData as Omit<Conference, 'id'>);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("Error saving conference");
    }
  };

  const onSaveClick = (status: 'Draft' | 'Published') => {
      const form = document.getElementById('conference-form') as HTMLFormElement;
      if (form && !form.checkValidity()) {
          form.reportValidity();
          return;
      }
      handleSave(status);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this conference? Events will be unlinked (not deleted).')) {
        await deleteConference(id, false);
        loadData();
    }
  };

  const filteredConferences = conferences.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-white mb-1">Conferences & Venues</h1>
           <p className="text-txt-dim text-sm">Manage parent conferences. Click 'View' to see attached events.</p>
        </div>
        <button 
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primaryHover text-background px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
        >
            <Plus size={18} /> Add Conference
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-dim" />
            <input 
                type="text" 
                placeholder="Search conferences..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-primary/50 focus:outline-none placeholder-txt-dim"
            />
      </div>

      <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
           <div className="p-8 flex justify-center text-primary"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-txt-muted">
                <thead className="bg-white/[0.02] text-txt-dim uppercase text-xs font-bold">
                <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {filteredConferences.map((conf) => (
                    <tr key={conf.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">
                        <Link to={`/admin/conferences/${conf.id}`} className="hover:text-primary transition-colors">
                            {conf.name}
                        </Link>
                    </td>
                    <td className="px-6 py-4">{conf.location}</td>
                    <td className="px-6 py-4">{conf.dateRange}, {conf.year}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${conf.status === 'Published' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-white/5 text-txt-muted border-white/10'}`}>
                            {conf.status || 'Draft'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Link to={`/admin/conferences/${conf.id}`} className="p-2 text-txt-muted hover:bg-white/10 hover:text-white rounded-lg" title="View Details">
                                <Eye size={16} />
                            </Link>
                            <button onClick={() => handleOpenModal(conf)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg" title="Edit">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(conf.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg" title="Delete">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Conference' : 'New Conference'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-txt-dim hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <form id="conference-form" className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Conference Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">City</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Country</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.country}
                                onChange={e => setFormData({...formData, country: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Start Date</label>
                            <input 
                                required
                                type="date" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.startDate}
                                onChange={e => setFormData({...formData, startDate: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">End Date</label>
                            <input 
                                required
                                type="date" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.endDate}
                                onChange={e => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Website URL</label>
                            <input 
                                type="url" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                value={formData.websiteUrl || ''}
                                onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                                placeholder="https://"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Description</label>
                        <textarea 
                            rows={4}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-txt-muted">Banner Image URL</label>
                        <input 
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            value={formData.bannerImage || ''}
                            onChange={e => setFormData({...formData, bannerImage: e.target.value})}
                            placeholder="https://"
                        />
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
                                <Send size={16} /> {formData.status === 'Published' ? 'Update & Publish' : 'Publish Conference'}
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

export default ConferencesManager;
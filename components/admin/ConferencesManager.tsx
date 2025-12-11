import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchConferences, 
  createConference, 
  updateConference, 
  deleteConference 
} from '../../services/db';
import { Conference } from '../../types';
import { Plus, Edit2, Trash2, Search, X, Loader2, Eye, Calendar, Globe } from 'lucide-react';
import { MONTHS } from '../../constants';

const ConferencesManager: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Auto-generate some derived fields for display if not manually set
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
          dateRange: dateRange
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
           <p className="text-gray-500 text-sm">Manage parent conferences. Click 'View' to see attached events.</p>
        </div>
        <button 
            onClick={() => handleOpenModal()}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
            <Plus size={18} /> Add Conference
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
                type="text" 
                placeholder="Search conferences..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surfaceHighlight border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
      </div>

      <div className="bg-surfaceHighlight border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
           <div className="p-8 flex justify-center text-purple-500"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 text-gray-200 uppercase text-xs font-bold">
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
                        <Link to={`/admin/conferences/${conf.id}`} className="hover:text-purple-400 transition-colors">
                            {conf.name}
                        </Link>
                    </td>
                    <td className="px-6 py-4">{conf.location}</td>
                    <td className="px-6 py-4">{conf.dateRange}, {conf.year}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${conf.status === 'Published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                            {conf.status || 'Draft'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Link to={`/admin/conferences/${conf.id}`} className="p-2 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg" title="View Details">
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
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Conference Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">City</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Country</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.country}
                                onChange={e => setFormData({...formData, country: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Start Date</label>
                            <input 
                                required
                                type="date" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.startDate}
                                onChange={e => setFormData({...formData, startDate: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">End Date</label>
                            <input 
                                required
                                type="date" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.endDate}
                                onChange={e => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Website URL</label>
                            <input 
                                type="url" 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.websiteUrl || ''}
                                onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                                placeholder="https://"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Status</label>
                            <select 
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value as any})}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Description</label>
                        <textarea 
                            rows={4}
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Banner Image URL</label>
                        <input 
                            type="text" 
                            className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                            value={formData.bannerImage || ''}
                            onChange={e => setFormData({...formData, bannerImage: e.target.value})}
                            placeholder="https://"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2 rounded-lg text-gray-400 hover:text-white font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                        >
                            {editingId ? 'Save Changes' : 'Create Conference'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ConferencesManager;
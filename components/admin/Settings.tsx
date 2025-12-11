import React from 'react';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-white mb-6">System Settings</h1>
        
        <div className="space-y-8">
            {/* General */}
            <section className="bg-surfaceHighlight border border-white/5 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">General Configuration</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Site Name</label>
                            <input type="text" defaultValue="Conference Nights" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Contact Email</label>
                            <input type="email" defaultValue="support@conferencenights.com" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">SEO Meta Description</label>
                        <textarea rows={3} defaultValue="The ultimate directory for conference side-events and parties." className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white" />
                    </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="bg-surfaceHighlight border border-white/5 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Notifications</h2>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-gray-300">Email me when new conferences are submitted</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500" />
                        <span className="text-sm text-gray-300">Email me when new events are submitted</span>
                    </label>
                </div>
            </section>

             <div className="flex justify-end">
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2">
                    <Save size={18} /> Save Settings
                </button>
             </div>
        </div>
    </div>
  );
};

export default Settings;
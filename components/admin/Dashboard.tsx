import React, { useEffect, useState } from 'react';
import { fetchAllEvents, fetchConferences } from '../../services/db';
import { Calendar, MapPin, Users, TrendingUp, Clock, ArrowRight, Layers } from 'lucide-react';
import { EventItem, Conference } from '../../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalConferences: 0,
    totalHosts: 0
  });
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [recentConferences, setRecentConferences] = useState<Conference[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [events, conferences] = await Promise.all([
          fetchAllEvents(),
          fetchConferences()
        ]);

        const today = new Date().toISOString().split('T')[0];
        const upcoming = events.filter(e => e.date >= today).length;
        const hosts = new Set(events.map(e => e.host)).size;

        setStats({
          totalEvents: events.length,
          upcomingEvents: upcoming,
          totalConferences: conferences.length,
          totalHosts: hosts
        });

        // Get last 5 events
        setRecentEvents(events.slice(0, 5));
        setRecentConferences(conferences.slice(0, 4));
      } catch (error) {
        console.error("Error loading stats", error);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Conferences', value: stats.totalConferences, icon: Layers, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Upcoming', value: stats.upcomingEvents, icon: Clock, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { label: 'Unique Hosts', value: stats.totalHosts, icon: Users, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
        <div className="text-sm text-gray-400">
          Welcome back, Admin. Here's what's happening.
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-surfaceHighlight border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              {idx === 0 && <span className="text-green-500 text-xs font-medium flex items-center gap-1">+12% <TrendingUp size={12} /></span>}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Events Table */}
          <div className="lg:col-span-2 bg-surfaceHighlight border border-white/5 rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Latest Added Events</h2>
            <Link to="/admin/events" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                View All <ArrowRight size={14} />
            </Link>
            </div>
            <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 text-gray-200 uppercase text-xs font-bold">
                <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Host</th>
                    <th className="px-6 py-4">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {recentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                    <td className="px-6 py-4">{event.date}</td>
                    <td className="px-6 py-4">{event.host}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${event.status === 'Published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                        {event.status || 'Draft'}
                        </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
          </div>

          {/* Recent Conferences List */}
          <div className="lg:col-span-1 bg-surfaceHighlight border border-white/5 rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Recent Venues</h2>
                <Link to="/admin/conferences" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                    Manage <ArrowRight size={14} />
                </Link>
            </div>
            <div className="flex-1 p-4 space-y-3">
                {recentConferences.map((conf) => (
                    <Link to={`/admin/conferences/${conf.id}`} key={conf.id} className="block group">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors">{conf.name}</h4>
                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{conf.year}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <MapPin size={12} /> {conf.city}, {conf.country}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
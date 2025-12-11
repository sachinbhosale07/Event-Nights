import React from 'react';
import { UserCheck, MoreVertical, Shield } from 'lucide-react';

const UsersManager: React.FC = () => {
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@conferencenights.com', role: 'Super Admin', status: 'Active', lastActive: 'Now' },
    { id: 2, name: 'Editor One', email: 'editor@conferencenights.com', role: 'Editor', status: 'Active', lastActive: '2h ago' },
  ];

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-2xl font-bold text-white mb-1">Users & Permissions</h1>
            <p className="text-gray-500 text-sm">Manage team access and roles.</p>
            </div>
            <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <UserCheck size={18} /> Invite User
            </button>
        </div>

        <div className="bg-surfaceHighlight border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 text-gray-200 uppercase text-xs font-bold">
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Last Active</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/[0.02]">
                            <td className="px-6 py-4">
                                <div className="font-bold text-white">{user.name}</div>
                                <div className="text-xs text-gray-600">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Shield size={14} className="text-purple-400" />
                                    {user.role}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">{user.lastActive}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 hover:bg-white/5 rounded text-gray-500 hover:text-white">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default UsersManager;
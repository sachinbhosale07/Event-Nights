
import React, { useState } from 'react';
import { UserCheck, MoreVertical, Shield, Plus, Search, X, Mail, Save, Edit2, Check, AlertCircle } from 'lucide-react';
import { User } from '../../types';

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'sachin@gmail.com', role: 'Admin', status: 'Active', lastActive: 'Now' },
  { id: '2', name: 'Editor One', email: 'editor@conferencenights.com', role: 'Editor', status: 'Active', lastActive: '2h ago' },
];

const UsersManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [inviteLoading, setInviteLoading] = useState(false);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Handle Invitation
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);

    // Simulate API call and Email sending
    setTimeout(() => {
        const newUser: User = {
            id: Date.now().toString(),
            name: inviteEmail.split('@')[0], // Default name from email
            email: inviteEmail,
            role: inviteRole,
            status: 'Invited',
            lastActive: 'Never'
        };

        setUsers([...users, newUser]);
        setInviteLoading(false);
        setIsInviteOpen(false);
        setInviteEmail('');
        alert(`Invitation sent to ${inviteEmail} successfully!`);
    }, 1000);
  };

  // Handle Edit Save
  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setIsEditOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Users & Permissions</h1>
                <p className="text-txt-dim text-sm">Manage team access, roles and invitations.</p>
            </div>
            <button 
                onClick={() => setIsInviteOpen(true)}
                className="bg-primary hover:bg-primaryHover text-background px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
            >
                <UserCheck size={18} /> Invite User
            </button>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-dim" />
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-primary/50 focus:outline-none placeholder-txt-dim"
            />
        </div>

        {/* Table */}
        <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-txt-muted">
                    <thead className="bg-white/[0.02] text-txt-dim uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white">{user.name}</div>
                                    <div className="text-xs text-txt-dim">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Shield size={14} className={user.role === 'Admin' ? 'text-primary' : 'text-purple-400'} />
                                        {user.role}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs border font-bold ${
                                        user.status === 'Active' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                            : user.status === 'Invited'
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                : 'bg-white/5 text-txt-dim border-white/10'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{user.lastActive}</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => {
                                            setEditingUser(user);
                                            setIsEditOpen(true);
                                        }}
                                        className="p-2 hover:bg-white/5 rounded text-txt-dim hover:text-white transition-colors"
                                        title="Edit User"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-txt-dim">No users found.</div>
            )}
        </div>

        {/* --- INVITE MODAL --- */}
        {isInviteOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
                    <div className="flex justify-between items-center p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">Invite User</h2>
                        <button onClick={() => setIsInviteOpen(false)} className="text-txt-dim hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleInvite} className="p-6 space-y-4">
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex gap-3 items-start">
                            <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-txt-dim">
                                The user will receive an email invitation to join the team. They will be required to set a password upon login.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-dim" size={18} />
                                <input 
                                    required
                                    type="email" 
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-primary/50 outline-none placeholder-txt-dim"
                                    placeholder="colleague@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Role</label>
                            <select 
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value as any)}
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            >
                                <option value="Admin">Admin (Full Access)</option>
                                <option value="Editor">Editor (Manage Content)</option>
                                <option value="Viewer">Viewer (Read Only)</option>
                            </select>
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                             <button 
                                type="button"
                                onClick={() => setIsInviteOpen(false)}
                                className="px-4 py-2 rounded-lg text-txt-muted hover:text-white font-medium hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={inviteLoading}
                                className="bg-primary hover:bg-primaryHover text-background px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center gap-2"
                            >
                                {inviteLoading ? 'Sending...' : 'Send Invite'}
                                {!inviteLoading && <Mail size={16} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* --- EDIT MODAL --- */}
        {isEditOpen && editingUser && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
                    <div className="flex justify-between items-center p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                        <button onClick={() => setIsEditOpen(false)} className="text-txt-dim hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleEditSave} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Full Name</label>
                            <input 
                                required
                                type="text" 
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-txt-muted">Email</label>
                            <input 
                                required
                                type="email" 
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                            />
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-txt-muted">Role</label>
                                <select 
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-txt-muted">Status</label>
                                <select 
                                    value={editingUser.status}
                                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value as any})}
                                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary/50 outline-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Invited">Invited</option>
                                </select>
                            </div>
                         </div>

                        <div className="pt-2 flex justify-end gap-3">
                             <button 
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="px-4 py-2 rounded-lg text-txt-muted hover:text-white font-medium hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="bg-primary hover:bg-primaryHover text-background px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                Save Changes <Save size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default UsersManager;

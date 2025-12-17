import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  Users, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  Menu,
  Layers,
  UserCheck
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('cn_admin_session');
    if (!session) {
        navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('cn_admin_session');
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: MapPin, label: 'Venues', path: '/admin/conferences' },
    { icon: Layers, label: 'Categories', path: '/admin/categories' },
    { icon: Users, label: 'Organizers', path: '/admin/organizers' },
    { icon: UserCheck, label: 'Users', path: '/admin/users' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/5 flex-col fixed inset-y-0 z-50 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-surfaceHighlight border border-white/5 flex items-center justify-center mr-3 shadow-sm">
            <span className="font-bold text-primary text-xs">EN</span>
          </div>
          <span className="text-lg font-bold text-white">Admin Panel</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/10'
                    : 'text-txt-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button className="md:hidden p-2 text-txt-muted hover:bg-white/5 rounded-lg">
                <Menu size={20} />
             </button>
             <div className="relative hidden sm:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-dim" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-surface border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:border-primary/50 focus:outline-none w-64 placeholder-txt-dim"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-txt-muted hover:text-white relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">Super Admin</div>
                <div className="text-xs text-txt-dim">Administrator</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-surfaceHighlight border border-white/10 overflow-hidden flex items-center justify-center">
                <UserCheck size={18} className="text-txt-muted" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
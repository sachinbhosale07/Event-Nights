import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Public App
import PublicHome from './components/PublicHome';
import About from './components/pages/About';
import Terms from './components/pages/Terms';
import Privacy from './components/pages/Privacy';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import EventsManager from './components/admin/EventsManager';
import ConferencesManager from './components/admin/ConferencesManager';
import ConferenceDetails from './components/admin/ConferenceDetails';
import UsersManager from './components/admin/UsersManager';
import Settings from './components/admin/Settings';
import Login from './components/admin/Login';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventsManager />} />
          
          <Route path="conferences" element={<ConferencesManager />} />
          <Route path="conferences/:id" element={<ConferenceDetails />} />
          
          <Route path="users" element={<UsersManager />} />
          <Route path="settings" element={<Settings />} />
          
          <Route path="categories" element={<div className="text-gray-500 p-8">Categories Module (Coming Soon)</div>} />
          <Route path="organizers" element={<div className="text-gray-500 p-8">Organizers Module (Coming Soon)</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
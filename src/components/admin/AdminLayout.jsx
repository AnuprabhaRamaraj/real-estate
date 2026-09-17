import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { authService } from '../../services/authService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Menu, ShieldCheck } from 'lucide-react';

export function AdminLayout() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authService.isAuthenticated().then((isAuth) => {
      if (!isAuth) {
        navigate('/admin/login', { replace: true });
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    });
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner text="Checking authentication status..." />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span className="font-serif text-sm font-bold text-white">Admin Dashboard</span>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

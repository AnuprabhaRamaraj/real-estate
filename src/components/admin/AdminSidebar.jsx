import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, MessageSquare, Settings, LogOut, X, ExternalLink } from 'lucide-react';
import { authService } from '../../services/authService';

export function AdminSidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Properties', path: '/admin/properties', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-6 text-slate-300">
      
      {/* Top Header & Links */}
      <div className="space-y-8">
        
        <div className="flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-950 shadow-gold-glow">
              <Building2 className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-tight">Admin Portal</span>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">Real Estate Admin</span>
            </div>
          </Link>

          {mobileOpen && (
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                isActive(item.path)
                  ? 'bg-gold-500 text-slate-950 shadow-gold-glow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-6 border-t border-slate-800/80">
        
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-gold-400 transition-colors"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 font-semibold text-sm transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block w-64 bg-slate-950 border-r border-slate-800 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex">
          <div className="w-72 bg-slate-950 border-r border-slate-800 h-full shadow-2xl animate-slide-in">
            {navContent}
          </div>
          <div className="flex-1" onClick={onClose} />
        </div>
      )}
    </>
  );
}

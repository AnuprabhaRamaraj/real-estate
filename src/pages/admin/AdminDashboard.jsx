import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { enquiryService } from '../../services/enquiryService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  Building2, CheckCircle, EyeOff, Tag, CheckSquare, 
  PlusCircle, MessageSquare, ArrowRight, AlertTriangle 
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | Admin Portal';

    Promise.all([
      propertyService.getPropertyStats(),
      enquiryService.getAllEnquiries()
    ])
      .then(([statsData, enquiriesData]) => {
        setStats(statsData);
        setEnquiryCount(enquiriesData.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard statistics..." fullScreen={true} />;
  }

  const activeLimitReached = stats?.active >= 5;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Overview of property inventory, active public listings, and customer enquiries.
          </p>
        </div>

        <Link
          to="/admin/properties/new"
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm shadow-gold-glow transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Maximum 5 Active Alert Warning if reached */}
      {activeLimitReached && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3 text-amber-300 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-white">Maximum 5 Active Properties Limit Reached</span>
            <span>
              The system currently has 5 active properties. If you wish to activate a new property, deactivate or delete an existing property first.
            </span>
          </div>
        </div>
      )}

      {/* Section 9 requirement: Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
            <Building2 className="w-4 h-4 text-gold-400" />
          </div>
          <span className="font-sans text-3xl font-extrabold text-white block">
            {stats?.total || 0}
          </span>
          <span className="text-[11px] text-slate-500 block">Properties in system</span>
        </div>

        {/* Active */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-sans text-3xl font-extrabold text-emerald-400">
              {stats?.active || 0}
            </span>
            <span className="text-xs text-slate-400">/ 5 max</span>
          </div>
          <span className="text-[11px] text-slate-400 block">Live on public site</span>
        </div>

        {/* Inactive */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Inactive</span>
            <EyeOff className="w-4 h-4 text-slate-500" />
          </div>
          <span className="font-sans text-3xl font-extrabold text-slate-400 block">
            {stats?.inactive || 0}
          </span>
          <span className="text-[11px] text-slate-500 block">Hidden / Archived</span>
        </div>

        {/* Available */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Available</span>
            <Tag className="w-4 h-4 text-gold-400" />
          </div>
          <span className="font-sans text-3xl font-extrabold text-white block">
            {stats?.available || 0}
          </span>
          <span className="text-[11px] text-slate-500 block">Open for booking</span>
        </div>

        {/* Sold */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Sold Out</span>
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="font-sans text-3xl font-extrabold text-rose-400 block">
            {stats?.sold || 0}
          </span>
          <span className="text-[11px] text-slate-500 block">Completed sales</span>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        <Link
          to="/admin/properties"
          className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 transition-all space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
              Manage Properties
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Add, edit, deactivate, or delete properties from your showcase inventory.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/enquiries"
          className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-gold-500/40 transition-all space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-slate-950">
              {enquiryCount} Enquiries
            </span>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
              Customer Enquiries
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Review interest messages and contact details submitted by website visitors.
            </p>
          </div>
        </Link>

      </div>

    </div>
  );
}

import React from 'react';
import { PropertyCard } from './PropertyCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { PhoneCall, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PropertyGrid({ properties, loading, error }) {
  if (loading) {
    return <LoadingSpinner text="Fetching active property listings..." fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-center max-w-lg mx-auto my-8">
        <p className="text-rose-300 font-medium text-sm">Unable to load property details. Please refresh or try again.</p>
      </div>
    );
  }

  // Empty Property State
  if (!properties || properties.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-14 h-14 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto mb-5 border border-gold-500/20">
          <Sparkles className="w-7 h-7" />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
          New Properties Coming Soon
        </h3>
        
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
          New properties are coming soon. Please contact us for upcoming opportunities or to share your customized real estate requirements.
        </p>

        <div className="flex items-center justify-center">
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm shadow-gold-glow transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

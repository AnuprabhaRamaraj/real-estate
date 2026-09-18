import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { propertyService } from '../services/propertyService';
import { settingsService } from '../services/settingsService';
import { 
  Building2, ArrowRight, ShieldCheck, MapPin, Sparkles, PhoneCall, 
  Award, FileCheck2, Headphones, TrendingUp, CheckCircle 
} from 'lucide-react';

export function Home() {
  const [properties, setProperties] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Apex Estates | Premium Real Estate & Luxury Properties';
    
    Promise.all([
      propertyService.getActiveProperties(),
      settingsService.getSettings()
    ])
      .then(([propsData, settingsData]) => {
        setProperties(propsData);
        setSettings(settingsData);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const heroHeading = settings?.hero_heading || 'Find the Right Place for Your Future';
  const heroDescription = settings?.hero_description || 'Discover hand-picked premium residential plots, luxury villas, and prime commercial estates with uncompromised trust.';

  // Section 17 requirement: Why Choose Us cards
  const whyChooseUsCards = [
    {
      icon: <Award className="w-6 h-6 text-gold-400" />,
      title: 'Trusted Properties',
      description: '100% verified legal documentation and clear title deeds for total peace of mind.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-gold-400" />,
      title: 'Transparent Pricing',
      description: 'Zero hidden charges, upfront rates per unit, and best-in-market price appreciation.'
    },
    {
      icon: <MapPin className="w-6 h-6 text-gold-400" />,
      title: 'Prime Locations',
      description: 'Strategically located in high-growth residential corridors with superior infrastructure.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-gold-400" />,
      title: 'Customer Support',
      description: 'Dedicated relationship managers to guide you from initial inquiry to final registration.'
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-gold-400" />,
      title: 'Verified Documentation',
      description: 'DTCP & RERA approved layouts with pre-approved home loan options from major banks.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-gold-400" />,
      title: 'Professional Service',
      description: 'Over 15+ years of excellence with hundreds of happy property owners.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION (Section 4 requirement) */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
        
        {/* Background Image Overlay with Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Real Estate Hero"
            className="w-full h-full object-cover object-center filter brightness-[0.35] scale-105 transform animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80" />
        </div>

        {/* Ambient Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/80 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest backdrop-blur-md animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Exclusive Property Showcase</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            {heroHeading}
          </h1>

          <p className="text-slate-300 text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
            {heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/properties"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold text-base shadow-gold-glow transition-all active:scale-95"
            >
              <span>View Properties</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:border-gold-500/50 font-bold text-base backdrop-blur-md transition-all active:scale-95"
            >
              <PhoneCall className="w-5 h-5 text-gold-400" />
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Key Stat Highlights */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-center border-t border-slate-800/80">
            <div>
              <span className="block font-sans text-2xl sm:text-3xl font-extrabold text-white">100%</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Clear Title Deeds</span>
            </div>
            <div>
              <span className="block font-sans text-2xl sm:text-3xl font-extrabold text-gold-400">Max 5</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Curated Active Estates</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block font-sans text-2xl sm:text-3xl font-extrabold text-white">15+ Yrs</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Industry Excellence</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED ESTATES SECTION (Section 5 requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Building2 className="w-4 h-4" />
              <span>Hand-Picked Listings</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Featured Estates & Properties
            </h2>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 font-bold text-sm transition-colors group"
          >
            <span>Explore All Active Estates</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <PropertyGrid
          properties={properties}
          loading={loading}
          error={error}
        />
      </section>

      {/* 3. WHY CHOOSE US SECTION (Section 17 requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">
            Unmatched Quality & Commitment
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Why Choose {settings?.company_name || 'Apex Estates'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            We prioritize quality over quantity. Every property showcased on our portal passes stringent legal, environmental, and engineering checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUsCards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1 space-y-3 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-white">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ABOUT US SUMMARY SECTION (Section 16 requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">
                About Our Company
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-snug">
                Building Futures & Preserving Real Estate Value
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {settings?.company_name || 'Apex Estates'} is a premier real-estate property showcase company dedicated to discovering and promoting exclusive land layouts, luxury residential villas, and prime commercial plots.
              </p>
              
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>Strict limit of maximum 5 active top-grade properties</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>Direct developer pricing with zero middleman markups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>Comprehensive site visits and hassle-free documentation</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
                >
                  <span>Read Full About Us</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury Real Estate Company"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

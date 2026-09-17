import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { settingsService } from '../services/settingsService';
import { Building2, ShieldCheck, Target, Eye, Award, CheckCircle, ArrowRight, PhoneCall } from 'lucide-react';

export function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    document.title = 'About Us | Apex Estates';
    settingsService.getSettings().then(setSettings).catch(console.error);
  }, []);

  const companyName = settings?.company_name || 'Apex Estates';

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
          <Building2 className="w-4 h-4" />
          <span>Real Estate Company Profile</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          About {companyName}
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Dedicated to showcasing verified luxury villas, gated plot layouts, and high-growth commercial real estate with uncompromised transparency.
        </p>
      </div>

      {/* Intro Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Excellence in Real Estate Development & Curation
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {companyName} operates as a specialized showcase portal for premier properties. Unlike generic market aggregators listing thousands of unverified properties, we restrict our public website to a maximum of 5 active, top-grade estates at any given time.
          </p>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            This deliberate focus ensures that every property listed undergoes meticulous title search, environmental review, infrastructure check, and pricing evaluation before being presented to our discerning clients.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-sans text-2xl font-extrabold text-gold-400">100%</span>
              <span className="text-xs text-slate-400 font-medium">Verified Clear Titles</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-sans text-2xl font-extrabold text-white">Max 5</span>
              <span className="text-xs text-slate-400 font-medium">Active Property Limit</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-luxury">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"
            alt={`${companyName} Overview`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center border border-gold-500/20">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Our Mission</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            To provide home buyers and real estate investors with transparent, legally vetted, high-appreciation properties while delivering an effortless, premium showcase experience.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center border border-gold-500/20">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Our Vision</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            To be the most trusted luxury real estate company, recognized for curated quality, direct owner pricing, and zero compromise on legal documentation standards.
          </p>
        </div>
      </div>

      {/* Core Quality & Trust Guarantees */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Quality & Trust Guarantees
          </h2>
          <p className="text-slate-400 text-sm">
            We adhere to strict standards to safeguard your investment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-gold-400" />
            <h4 className="font-bold text-white text-base">Clear Title Deed</h4>
            <p className="text-slate-400 text-xs leading-relaxed">Encumbrance-free properties verified by legal experts.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <Award className="w-8 h-8 text-gold-400" />
            <h4 className="font-bold text-white text-base">DTCP / RERA Approved</h4>
            <p className="text-slate-400 text-xs leading-relaxed">Full government approvals and statutory compliance.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <Building2 className="w-8 h-8 text-gold-400" />
            <h4 className="font-bold text-white text-base">Prime Infrastructure</h4>
            <p className="text-slate-400 text-xs leading-relaxed">Bituminous roads, electricity, water, and security.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <CheckCircle className="w-8 h-8 text-gold-400" />
            <h4 className="font-bold text-white text-base">No Hidden Costs</h4>
            <p className="text-slate-400 text-xs leading-relaxed">Direct transparent rate per square foot breakdown.</p>
          </div>
        </div>
      </div>

      {/* Call To Action Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-slate-950 text-center space-y-6 shadow-gold-glow">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold">
          Ready to Find Your Ideal Property?
        </h2>
        <p className="text-slate-950/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
          Contact our sales team today to schedule a personal site visit or get customized project details.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/properties"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-slate-900 transition-all"
          >
            View Active Estates
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/20 hover:bg-slate-900/30 text-slate-950 font-bold text-sm border border-slate-950/40 transition-all"
          >
            Contact Sales Team
          </Link>
        </div>
      </div>

    </div>
  );
}

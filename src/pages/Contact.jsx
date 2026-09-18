import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';
import { FeedbackForm } from '../components/property/FeedbackForm';
import { 
  Phone, Mail, MapPin, MessageSquare, Clock, Globe, 
  PhoneCall, ExternalLink, Facebook, Instagram, Youtube 
} from 'lucide-react';

export function Contact() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    document.title = 'Contact & Feedback | Apex Estates';
    settingsService.getSettings().then(setSettings).catch(console.error);
  }, []);

  const companyName = settings?.company_name || 'Apex Estates';
  const phone = settings?.phone_number || '+91 98765 43210';
  const email = settings?.email || 'contact@apexestates.com';
  const address = settings?.address || '123 Luxury Avenue, Race Course, Coimbatore, TN 641018';

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
          <MessageSquare className="w-4 h-4" />
          <span>Get In Touch</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Contact Us & Send Feedback
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Have questions regarding our available properties or want to schedule a site visit? Reach out to us directly or fill out the enquiry form below.
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center space-x-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-gold-500/40 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg group"
        >
          <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-slate-950 transition-colors">
            <PhoneCall className="w-5 h-5" />
          </div>
          <span>Call Sales Office</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="flex items-center justify-center space-x-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-gold-500/40 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg group"
        >
          <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-slate-950 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <span>Email Us</span>
        </a>

        <a
          href="#enquiry-form"
          className="flex items-center justify-center space-x-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-gold-500/40 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg group"
        >
          <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-slate-950 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span>Submit Form</span>
        </a>
      </div>

      {/* Main Grid: Contact Info vs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Contact Details & Office Hours */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white border-l-2 border-gold-500 pl-3">
              Office Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-gold-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Corporate Address</h4>
                  <p className="text-sm font-medium text-white leading-relaxed">{address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-gold-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Phone Number</h4>
                  <p className="text-sm font-medium text-white">{phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-gold-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Email Address</h4>
                  <p className="text-sm font-medium text-white">{email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-gold-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Business Hours</h4>
                  <p className="text-sm font-medium text-white">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p className="text-xs text-slate-400">Sunday: By Prior Site Visit Appointment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Connect With Us</h4>
            <div className="flex items-center space-x-3">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-gold-400 hover:border-gold-500 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-gold-400 hover:border-gold-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-gold-400 hover:border-gold-500 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Feedback Form (Section 19 requirement) */}
        <div id="enquiry-form" className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white">Send Us a Direct Message</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Fill out this quick form and our sales coordinator will respond within 2 business hours.
            </p>
          </div>

          <FeedbackForm />
        </div>

      </div>

    </div>
  );
}

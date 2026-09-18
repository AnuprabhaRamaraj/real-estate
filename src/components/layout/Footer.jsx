import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Lock } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { propertyService } from '../../services/propertyService';

export function Footer() {
  const [settings, setSettings] = useState(null);
  const [activeProps, setActiveProps] = useState([]);

  useEffect(() => {
    settingsService.getSettings().then(setSettings).catch(console.error);
    propertyService.getActiveProperties().then(setActiveProps).catch(console.error);
  }, []);

  const companyName = settings?.company_name || 'Apex Estates';

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Company Profile */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-950 shadow-gold-glow">
                <Building2 className="w-5 h-5 font-bold" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                {companyName}
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400">
              {settings?.hero_description || 'Showcasing ultra-luxury properties, premium gated villa communities, and high-appreciation residential land plots with complete transparency.'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-gold-500 hover:text-gold-400 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-gold-500 hover:text-gold-400 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-gold-500 hover:text-gold-400 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">About Our Company</Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-gold-400 transition-colors">Featured Estates</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">Contact & Enquiries</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-gold-400 transition-colors flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Active Estates */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-3">
              Active Properties
            </h4>
            <ul className="space-y-2.5 text-sm">
              {activeProps.length > 0 ? (
                activeProps.map((prop) => (
                  <li key={prop.id}>
                    <Link to={`/properties/${prop.slug}`} className="hover:text-gold-400 transition-colors line-clamp-1">
                      {prop.property_name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic text-xs">New properties coming soon</li>
              )}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-3">
              Reach Our Office
            </h4>

            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
              <span>{settings?.address || '123 Luxury Avenue, Race Course, Coimbatore, TN 641018'}</span>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{settings?.phone_number || '+91 98765 43210'}</span>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{settings?.email || 'contact@apexestates.com'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

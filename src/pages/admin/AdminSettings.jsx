import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import { Settings, Save, Building2, Phone, Mail, MapPin, Globe, Sparkles, Loader2 } from 'lucide-react';

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [settings, setSettings] = useState({
    company_name: '',
    logo_url: '',
    phone_number: '',
    email: '',
    address: '',
    hero_heading: '',
    hero_description: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: ''
  });

  useEffect(() => {
    document.title = 'Website Settings | Admin Portal';
    settingsService.getSettings()
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      setToast({ message: 'Website settings updated successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update website settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching website configuration..." fullScreen={true} />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Website Branding & Settings
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Update company details, contact information, and homepage hero section copy.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm shadow-gold-glow transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Company Information */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
            <Building2 className="w-5 h-5 text-gold-400" />
            <span>Company Branding & Contacts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={settings.company_name}
                onChange={handleChange}
                placeholder="e.g. Apex Estates"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Logo Image URL (Optional)
              </label>
              <input
                type="url"
                name="logo_url"
                value={settings.logo_url}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={settings.phone_number}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="contact@apexestates.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Corporate Office Address
              </label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                placeholder="123 Luxury Avenue, Race Course, Coimbatore, Tamil Nadu - 641018"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Hero Section Copy */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span>Homepage Hero Section Copy</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Hero Heading Title
              </label>
              <input
                type="text"
                name="hero_heading"
                value={settings.hero_heading}
                onChange={handleChange}
                placeholder="Find the Right Place for Your Future"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Hero Short Description
              </label>
              <textarea
                name="hero_description"
                rows={3}
                value={settings.hero_description}
                onChange={handleChange}
                placeholder="Discover hand-picked premium residential plots, luxury villas, and prime commercial spaces with uncompromised trust."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Social Media URLs */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
            <Globe className="w-5 h-5 text-gold-400" />
            <span>Social Media Handles</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Facebook URL</label>
              <input
                type="url"
                name="facebook_url"
                value={settings.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagram_url"
                value={settings.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">YouTube URL</label>
              <input
                type="url"
                name="youtube_url"
                value={settings.youtube_url}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm shadow-gold-glow flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}

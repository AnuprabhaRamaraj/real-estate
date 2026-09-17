import React, { useState, useEffect } from 'react';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { propertyService } from '../services/propertyService';
import { settingsService } from '../services/settingsService';
import { Building2, Filter } from 'lucide-react';

export function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Active Estates & Properties | Apex Estates';

    Promise.all([
      propertyService.getActiveProperties(),
      settingsService.getSettings()
    ])
      .then(([propsData, settingsData]) => {
        setProperties(propsData);
        setFilteredProperties(propsData);
        setSettings(settingsData);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (type === 'All') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(p => (p.property_type || '').toLowerCase().includes(type.toLowerCase())));
    }
  };

  const propertyTypes = ['All', 'Villa', 'Plot', 'Commercial', 'Apartment'];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
          <Building2 className="w-4 h-4" />
          <span>Curated Real Estate Collection</span>
        </div>
        
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Active Properties & Estates
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Browse our hand-picked active properties. We maintain a strict limit of maximum 5 active properties to guarantee quality and personalized customer attention.
        </p>
      </div>

      {/* Property Type Filter Tabs */}
      {properties.length > 0 && (
        <div className="flex items-center justify-center space-x-2 overflow-x-auto py-2">
          <div className="flex items-center space-x-1 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <Filter className="w-4 h-4 text-gold-400 ml-2 mr-1 hidden sm:block" />
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedType === type
                    ? 'bg-gold-500 text-slate-950 shadow-gold-glow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Property Grid */}
      <PropertyGrid
        properties={filteredProperties}
        loading={loading}
        error={error}
        whatsappNumber={settings?.whatsapp_number}
      />

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { settingsService } from '../services/settingsService';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { VideoSection } from '../components/property/VideoSection';
import { FeedbackForm } from '../components/property/FeedbackForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  MapPin, CheckCircle, Sparkles, PhoneCall, ArrowLeft, 
  Ruler, Layers, Building, Tag, ExternalLink, Calendar, Info, Share2 
} from 'lucide-react';

export function PropertyDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      propertyService.getPropertyBySlug(slug),
      settingsService.getSettings()
    ])
      .then(([propData, settingsData]) => {
        if (!propData) {
          setError(true);
        } else {
          setProperty(propData);
          document.title = `${propData.property_name} | ${settingsData?.company_name || 'Apex Estates'}`;
        }
        setSettings(settingsData);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20">
        <LoadingSpinner text="Loading property details..." fullScreen={true} />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <Info className="w-12 h-12 text-gold-400 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-white">Property Not Found</h2>
          <p className="text-slate-400 text-sm">
            The property listing you are looking for may have been removed or deactivated.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gold-500 text-slate-950 font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Properties</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    id,
    property_name,
    short_description,
    description,
    property_type,
    location,
    city,
    district,
    state,
    pincode,
    google_maps_url,
    price,
    original_price,
    rate,
    discount_percentage,
    offer_title,
    offer_description,
    property_size,
    total_units,
    availability,
    status,
    main_image_url,
    image_urls,
    video_url,
    amenities
  } = property;

  const currentStatus = availability || status || 'Available';

  const formatCurrency = (amount) => {
    if (!amount) return 'Price on Request';
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return `₹${amount}`;
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Back Button & Header */}
      <div className="space-y-4">
        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-gold-400 font-semibold text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/30">
                {property_type || 'Villa'}
              </span>
              
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                currentStatus === 'Available'
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
              }`}>
                {currentStatus}
              </span>

              {discount_percentage > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950">
                  {discount_percentage}% OFF SPECIAL OFFER
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {property_name}
            </h1>

            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{[location, city, district, state, pincode].filter(Boolean).join(', ')}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between lg:flex-col lg:items-end space-x-4 lg:space-x-0">
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-400 block font-semibold">
                Starting Price
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
                  {formatCurrency(price)}
                </span>
                {original_price && original_price > price && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatCurrency(original_price)}
                  </span>
                )}
              </div>
              {rate && <span className="text-xs text-gold-400 font-semibold block">{rate}</span>}
            </div>

            <div className="mt-2 lg:mt-3 flex items-center space-x-2">
              <a
                href={`tel:${settings?.phone_number || '+919876543210'}`}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs shadow-gold-glow transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Sales Office</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Gallery & Specifications vs Enquiry Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Cols: Media & Specs */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Gallery */}
          <PropertyGallery
            images={image_urls}
            mainImage={main_image_url}
            title={property_name}
          />

          {/* Promotional Offer Banner (Section 15 requirement) */}
          {(offer_title || offer_description || discount_percentage > 0) && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 space-y-2 relative overflow-hidden shadow-xl">
              <div className="flex items-center space-x-2 text-gold-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-white">
                  {offer_title || 'Limited Period Promotional Offer'}
                </h3>
              </div>
              {offer_description && (
                <p className="text-slate-300 text-sm leading-relaxed">
                  {offer_description}
                </p>
              )}
            </div>
          )}

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            {property_size && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <Ruler className="w-4 h-4 text-gold-400" />
                  <span>Property Size</span>
                </div>
                <p className="text-base font-bold text-white">{property_size}</p>
              </div>
            )}

            {total_units && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <Layers className="w-4 h-4 text-gold-400" />
                  <span>Units / Plots</span>
                </div>
                <p className="text-base font-bold text-white">{total_units} Units</p>
              </div>
            )}

            {property_type && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <Building className="w-4 h-4 text-gold-400" />
                  <span>Property Type</span>
                </div>
                <p className="text-base font-bold text-white">{property_type}</p>
              </div>
            )}

            {currentStatus && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <Tag className="w-4 h-4 text-gold-400" />
                  <span>Status</span>
                </div>
                <p className="text-base font-bold text-white">{currentStatus}</p>
              </div>
            )}
          </div>

          {/* Detailed Overview */}
          {description && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-white border-l-2 border-gold-500 pl-3">
                Property Overview & Description
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Amenities */}
          {amenities && amenities.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-white border-l-2 border-gold-500 pl-3">
                Key Amenities & Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Section */}
          <VideoSection videoUrl={video_url} title={`${property_name} Video Walkthrough`} />

          {/* Location & Google Maps Section (Section 21 requirement) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-l-2 border-gold-500 pl-3">
              <h3 className="font-serif text-2xl font-bold text-white">Location & Neighborhood</h3>
              {google_maps_url && (
                <a
                  href={google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-gold-400 hover:underline font-semibold"
                >
                  <span>View Location on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-bold text-white">{location}</h4>
                  <p className="text-xs text-slate-400">
                    {[city, district, state, pincode].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              {google_maps_url && (
                <div className="pt-2">
                  <a
                    href={google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs w-full transition-all"
                  >
                    <MapPin className="w-4 h-4 text-gold-400" />
                    <span>Open in Google Maps Application</span>
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Sticky Enquiry Form */}
        <div className="space-y-6">
          <div className="sticky top-28 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-white">Enquire About This Property</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Send a message directly to our sales office or call us directly for instant site visit arrangement.
              </p>
            </div>

            {/* Direct Call Button */}
            <div className="pt-2">
              <a
                href={`tel:${settings?.phone_number || '+919876543210'}`}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm shadow-gold-glow transition-all active:scale-98"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Sales Office Directly</span>
              </a>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-semibold">Or send enquiry form</span>
              </div>
            </div>

            {/* Feedback Form */}
            <FeedbackForm
              preselectedProperty={property_name}
              propertyId={id}
            />

          </div>
        </div>

      </div>

    </div>
  );
}

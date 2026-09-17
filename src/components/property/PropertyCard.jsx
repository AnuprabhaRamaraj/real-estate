import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Tag, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export function PropertyCard({ property }) {
  if (!property) return null;

  const {
    property_name,
    slug,
    short_description,
    location,
    price,
    original_price,
    rate,
    discount_percentage,
    offer_title,
    property_type,
    availability,
    status,
    main_image_url
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

  const hasDiscount = discount_percentage > 0 || (original_price && price && original_price > price);
  const discountText = discount_percentage ? `${discount_percentage}% OFF` : 'SPECIAL OFFER';

  return (
    <div className="group bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-gold-500/50 shadow-luxury hover:shadow-gold-glow transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1.5">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={main_image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
          alt={property_name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-gold-400 border border-gold-500/30">
            {property_type || 'Estate'}
          </span>

          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${
            currentStatus === 'Available'
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
              : currentStatus === 'Sold'
              ? 'bg-rose-950/80 text-rose-400 border-rose-500/30'
              : 'bg-amber-950/80 text-amber-400 border-amber-500/30'
          }`}>
            {currentStatus}
          </span>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-gold-600 text-slate-950 font-extrabold text-xs shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{discountText}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span className="truncate">{location || 'Prime Location'}</span>
          </div>

          <h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-1">
            {property_name}
          </h3>

          {short_description && (
            <p className="text-slate-400 text-xs leading-relaxed mt-2 line-clamp-2">
              {short_description}
            </p>
          )}
        </div>

        {/* Pricing & Rate */}
        <div className="pt-3 border-t border-slate-800/80 flex items-end justify-between">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Starting From
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="font-sans text-lg sm:text-xl font-extrabold text-white">
                {formatCurrency(price)}
              </span>
              {original_price && original_price > price && (
                <span className="text-xs text-slate-500 line-through">
                  {formatCurrency(original_price)}
                </span>
              )}
            </div>
            {rate && (
              <span className="block text-[11px] text-gold-400 font-medium mt-0.5">
                {rate}
              </span>
            )}
          </div>

          <Link
            to={`/properties/${slug}`}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-gold-500 text-slate-200 hover:text-slate-950 font-bold text-xs transition-all duration-200 active:scale-95 shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

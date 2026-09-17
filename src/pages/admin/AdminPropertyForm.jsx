import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import { 
  Building2, ArrowLeft, Save, MapPin, Tag, Image as ImageIcon, 
  Video, Sparkles, CheckCircle, AlertTriangle, Loader2 
} from 'lucide-react';

export function AdminPropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    property_name: '',
    property_type: 'Villa',
    short_description: '',
    description: '',
    location: '',
    city: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '',
    google_maps_url: '',
    price: '',
    original_price: '',
    rate: '',
    price_unit: 'total',
    discount_percentage: 0,
    offer_title: '',
    offer_description: '',
    property_size: '',
    total_units: 1,
    availability: 'Available',
    status: 'Available',
    main_image_url: '',
    image_urls_raw: '',
    video_url: '',
    amenities_raw: '24/7 Security, Gated Layout, Underground Drainage',
    featured: false,
    active: true
  });

  useEffect(() => {
    document.title = isEdit ? 'Edit Property | Admin Portal' : 'Add Property | Admin Portal';

    if (isEdit) {
      propertyService.getAllProperties().then((all) => {
        const target = all.find((p) => p.id === id);
        if (target) {
          setFormData({
            ...target,
            price: target.price || '',
            original_price: target.original_price || '',
            discount_percentage: target.discount_percentage || 0,
            total_units: target.total_units || 1,
            image_urls_raw: (target.image_urls || []).join(', '),
            amenities_raw: (target.amenities || []).join(', ')
          });
        }
        setLoading(false);
      }).catch(console.error);
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.property_name.trim() || !formData.location.trim() || !formData.main_image_url.trim()) {
      setToast({ message: 'Please complete all required fields (Name, Location, Main Image URL).', type: 'error' });
      return;
    }

    setSaving(true);

    const imageArray = formData.image_urls_raw
      ? formData.image_urls_raw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const amenitiesArray = formData.amenities_raw
      ? formData.amenities_raw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : 0,
      discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : 0,
      total_units: formData.total_units ? parseInt(formData.total_units, 10) : 1,
      image_urls: imageArray,
      amenities: amenitiesArray
    };
    delete payload.image_urls_raw;
    delete payload.amenities_raw;

    try {
      if (isEdit) {
        await propertyService.updateProperty(id, payload);
        navigate('/admin/properties', {
          state: { toastMessage: 'Property updated successfully.', toastType: 'success' }
        });
      } else {
        await propertyService.addProperty(payload);
        navigate('/admin/properties', {
          state: { toastMessage: 'Property added successfully.', toastType: 'success' }
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        message: err.message || 'Maximum of 5 active properties allowed. Please deactivate or delete an existing property before adding another.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching property form details..." fullScreen={true} />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <Link
            to="/admin/properties"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-gold-400 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Property Inventory</span>
          </Link>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {isEdit ? 'Edit Property Details' : 'Add New Property'}
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm shadow-gold-glow transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEdit ? 'Save Changes' : 'Create Property'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Basic Information (Section 11 requirement) */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
            <Building2 className="w-5 h-5 text-gold-400" />
            <span>Basic Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Property Name <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                name="property_name"
                required
                value={formData.property_name}
                onChange={handleChange}
                placeholder="e.g. Green Valley Estate"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Property Type <span className="text-gold-400">*</span>
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              >
                <option value="Villa">Villa / Luxury Home</option>
                <option value="Gated Villa">Gated Villa Community</option>
                <option value="Residential Plot">Residential Plot / Land</option>
                <option value="Commercial">Commercial Property</option>
                <option value="Apartment">Apartment / Penthouse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Short Description (Card Subtitle)
              </label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="e.g. Luxury 4 BHK gated community villas near Race Course."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Full Detailed Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Comprehensive details regarding layout, construction specs, legal approvals, and surroundings."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Location & Google Maps (Section 11 & 21 requirement) */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
            <MapPin className="w-5 h-5 text-gold-400" />
            <span>Location Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Primary Location Name <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Race Course, Coimbatore"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="641018"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Google Maps URL
              </label>
              <input
                type="url"
                name="google_maps_url"
                value={formData.google_maps_url}
                onChange={handleChange}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Pricing & Discounts (Section 11 & 15 requirement) */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
            <Tag className="w-5 h-5 text-gold-400" />
            <span>Pricing & Promotional Offers</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Current Price (INR)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="12500000"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Original Price (For Discount Display)
              </label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleChange}
                placeholder="14500000"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Rate / Unit
              </label>
              <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                placeholder="e.g. ₹5,200 / sq.ft"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                placeholder="15"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Offer Badge Title
              </label>
              <input
                type="text"
                name="offer_title"
                value={formData.offer_title}
                onChange={handleChange}
                placeholder="e.g. Festive Early Bird Offer"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Offer Details & Description
              </label>
              <input
                type="text"
                name="offer_description"
                value={formData.offer_description}
                onChange={handleChange}
                placeholder="e.g. Complimentary Modular Kitchen setup."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Specs & Availability (Section 11 requirement) */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span>Specs & Amenities</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Property Size
              </label>
              <input
                type="text"
                name="property_size"
                value={formData.property_size}
                onChange={handleChange}
                placeholder="e.g. 3,800 sq.ft"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Number of Units / Plots
              </label>
              <input
                type="number"
                name="total_units"
                value={formData.total_units}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Availability Status
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Amenities (Comma separated)
              </label>
              <input
                type="text"
                name="amenities_raw"
                value={formData.amenities_raw}
                onChange={handleChange}
                placeholder="24/7 Security, Club House, Swimming Pool, Gated Layout"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* 5. Media URLs (Section 36 & 37 requirement) */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
            <ImageIcon className="w-5 h-5 text-gold-400" />
            <span>Media URLs (Images & Video)</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Main Property Image URL <span className="text-gold-400">*</span>
              </label>
              <input
                type="url"
                name="main_image_url"
                required
                value={formData.main_image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Additional Image Gallery URLs (Comma separated)
              </label>
              <textarea
                name="image_urls_raw"
                rows={2}
                value={formData.image_urls_raw}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/img1, https://images.unsplash.com/img2"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Video URL (YouTube / Cloudinary / External Video)
              </label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* 6. Display Settings & Max Active Check */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
            <CheckCircle className="w-5 h-5 text-gold-400" />
            <span>Display Settings</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-gold-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-white">Active (Show on Public Website)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-gold-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-white">Featured Highlight</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link
            to="/admin/properties"
            className="px-6 py-3 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-900 transition-colors font-semibold text-sm"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm shadow-gold-glow flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isEdit ? 'Update Property' : 'Publish Property'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

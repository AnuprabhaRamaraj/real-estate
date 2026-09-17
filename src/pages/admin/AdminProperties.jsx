import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import { 
  Building2, Plus, Edit, Eye, Trash2, CheckCircle, 
  XCircle, Search, ExternalLink, Sparkles 
} from 'lucide-react';

export function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals & Notifications
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const locationState = useLocation().state;

  const loadProperties = () => {
    setLoading(true);
    propertyService.getAllProperties()
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Property Management | Admin Portal';
    loadProperties();

    if (locationState?.toastMessage) {
      setToast({ message: locationState.toastMessage, type: locationState.toastType || 'success' });
    }
  }, [locationState]);

  // Toggle active status (Section 34 logic check)
  const handleToggleActive = async (id) => {
    try {
      await propertyService.toggleActiveStatus(id);
      loadProperties();
      setToast({ message: 'Property status updated successfully.', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Maximum 5 active properties allowed.', type: 'error' });
    }
  };

  // Delete property
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await propertyService.deleteProperty(deleteId);
      setDeleteId(null);
      loadProperties();
      setToast({ message: 'Property deleted successfully.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete property.', type: 'error' });
    }
  };

  const filteredProperties = properties.filter((p) =>
    (p.property_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.property_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = properties.filter(p => p.active).length;

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
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action will remove it from the website."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Property Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-gold-400">
              {activeCount} / 5 Active
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your properties, edit pricing, toggle active status, or update photos.
          </p>
        </div>

        <Link
          to="/admin/properties/new"
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm shadow-gold-glow transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, type, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Property Table (Section 28 requirement) */}
      {loading ? (
        <LoadingSpinner text="Fetching properties..." />
      ) : filteredProperties.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-300 font-semibold text-sm">No properties found.</p>
          <p className="text-slate-500 text-xs">Click "Add Property" to add your first listing.</p>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-900/50 transition-colors">
                    
                    {/* Property Thumbnail & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prop.main_image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80'}
                          alt={prop.property_name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-800"
                        />
                        <div>
                          <span className="font-bold text-white block line-clamp-1">
                            {prop.property_name}
                          </span>
                          <span className="text-xs text-gold-400 block font-medium">
                            {prop.property_type || 'Villa'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-slate-300">
                      <span className="line-clamp-1">{prop.location}</span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                      {formatCurrency(prop.price)}
                    </td>

                    {/* Status Pill */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        (prop.availability || prop.status) === 'Available'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                      }`}>
                        {prop.availability || prop.status || 'Available'}
                      </span>
                    </td>

                    {/* Active Toggle Switch */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(prop.id)}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          prop.active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                        title={prop.active ? 'Active on public website' : 'Inactive / Hidden'}
                      >
                        {prop.active ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/properties/${prop.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-gold-500 transition-colors"
                          title="View on Public Site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/properties/${prop.id}/edit`}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-gold-400 hover:border-gold-500 transition-colors"
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteId(prop.id)}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

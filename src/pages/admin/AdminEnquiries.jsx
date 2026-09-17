import React, { useState, useEffect } from 'react';
import { enquiryService } from '../../services/enquiryService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import { MessageSquare, Phone, Mail, Trash2, Calendar, User, Eye, X } from 'lucide-react';

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const loadEnquiries = () => {
    setLoading(true);
    enquiryService.getAllEnquiries()
      .then(setEnquiries)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Customer Enquiries | Admin Portal';
    loadEnquiries();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await enquiryService.deleteEnquiry(deleteId);
      setDeleteId(null);
      if (selectedEnquiry?.id === deleteId) setSelectedEnquiry(null);
      loadEnquiries();
      setToast({ message: 'Enquiry deleted successfully.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete enquiry.', type: 'error' });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Customer Enquiry"
        message="Are you sure you want to delete this enquiry record?"
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Customer Enquiries & Feedback
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Review customer site visit requests and property messages.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading enquiries..." />
      ) : enquiries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-300 font-semibold text-sm">No customer enquiries received yet.</p>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800 font-semibold">
                <tr>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Contact Phone</th>
                  <th className="px-6 py-4">Property Interested</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {enquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-gold-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          {item.email && <span className="text-xs text-slate-500 block">{item.email}</span>}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-gold-400">
                      <a href={`tel:${item.phone}`} className="hover:underline flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{item.phone}</span>
                      </a>
                    </td>

                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {item.property_name || 'General Inquiry'}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedEnquiry(item)}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-gold-500 transition-colors"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                          title="Delete Enquiry"
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

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">{selectedEnquiry.name}</h3>
                <span className="text-xs text-slate-400">{formatDate(selectedEnquiry.created_at)}</span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Phone: <a href={`tel:${selectedEnquiry.phone}`} className="text-gold-400 font-mono font-bold hover:underline">{selectedEnquiry.phone}</a></span>
              </div>

              {selectedEnquiry.email && (
                <div className="flex items-center space-x-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Email: {selectedEnquiry.email}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-slate-300">
                <MessageSquare className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Property: <strong className="text-white">{selectedEnquiry.property_name || 'General Inquiry'}</strong></span>
              </div>
            </div>

            {selectedEnquiry.message && (
              <div className="space-y-1">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Message Content</h4>
                <p className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.message}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name}, regarding your enquiry for ${selectedEnquiry.property_name || 'our property'}...`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Reply on WhatsApp
              </a>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

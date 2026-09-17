import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ENQUIRIES_LOCAL_KEY = 'apex_estates_enquiries';

const getLocalEnquiries = () => {
  try {
    const data = localStorage.getItem(ENQUIRIES_LOCAL_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading localStorage enquiries:', e);
  }
  return [
    {
      id: 'enq-1',
      name: 'Ramesh Kumar',
      phone: '+91 94433 12345',
      email: 'ramesh@example.com',
      property_id: 'demo-prop-1',
      property_name: 'Green Valley Estate',
      message: 'I am interested in visiting the 4 BHK villa at Green Valley Estate this weekend. Please contact me with availability.',
      status: 'new',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'enq-2',
      name: 'Priya Sharma',
      phone: '+91 98940 67890',
      email: 'priya.s@example.com',
      property_id: 'demo-prop-2',
      property_name: 'Royal Garden Estates',
      message: 'Please send complete price breakdown and floor plan for Royal Garden Estates.',
      status: 'contacted',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    }
  ];
};

const saveLocalEnquiries = (enquiries) => {
  localStorage.setItem(ENQUIRIES_LOCAL_KEY, JSON.stringify(enquiries));
};

export const enquiryService = {
  // Public: Submit enquiry form
  async submitEnquiry(enquiryData) {
    const newEnquiry = {
      ...enquiryData,
      status: 'new',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([newEnquiry])
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      newEnquiry.id = 'enq-' + Date.now();
      const current = getLocalEnquiries();
      const updated = [newEnquiry, ...current];
      saveLocalEnquiries(updated);
      return newEnquiry;
    }
  },

  // Admin: Get all enquiries
  async getAllEnquiries() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } else {
      return getLocalEnquiries();
    }
  },

  // Admin: Delete enquiry
  async deleteEnquiry(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } else {
      const current = getLocalEnquiries();
      const updated = current.filter(e => e.id !== id);
      saveLocalEnquiries(updated);
      return true;
    }
  }
};

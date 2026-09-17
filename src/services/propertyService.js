import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_PROPERTIES } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'apex_estates_properties';

// Helper to load properties from localStorage or seed initial data
const getLocalProperties = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading localStorage properties:', e);
  }
  // Save initial properties if empty
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
  return INITIAL_PROPERTIES;
};

// Helper to save properties to localStorage
const saveLocalProperties = (properties) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
};

export const propertyService = {
  // Public: Get all active properties (Max 5 active allowed)
  async getActiveProperties() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    } else {
      const all = getLocalProperties();
      return all.filter(p => p.active).slice(0, 5);
    }
  },

  // Get property by slug for public details page
  async getPropertyBySlug(slug) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) return null;
      return data;
    } else {
      const all = getLocalProperties();
      return all.find(p => p.slug === slug) || null;
    }
  },

  // Admin: Get all properties (Active & Inactive)
  async getAllProperties() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } else {
      return getLocalProperties();
    }
  },

  // Admin: Get property count statistics
  async getPropertyStats() {
    const properties = await this.getAllProperties();
    const total = properties.length;
    const active = properties.filter(p => p.active).length;
    const inactive = total - active;
    const available = properties.filter(p => p.status === 'Available' || p.availability === 'Available').length;
    const sold = properties.filter(p => p.status === 'Sold' || p.availability === 'Sold').length;

    return { total, active, inactive, available, sold };
  },

  // Admin: Add new property (with Max 5 Active validation)
  async addProperty(propertyData) {
    const all = await this.getAllProperties();
    const activeCount = all.filter(p => p.active).length;

    if (propertyData.active && activeCount >= 5) {
      throw new Error('Maximum of 5 active properties allowed. Please deactivate or delete an existing property before adding another.');
    }

    // Generate unique slug
    let baseSlug = propertyData.property_name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    if (!baseSlug) baseSlug = 'property-' + Date.now();
    let slug = baseSlug;
    let counter = 1;
    while (all.some(p => p.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProperty = {
      ...propertyData,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .insert([newProperty])
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      newProperty.id = 'prop-' + Date.now();
      const updatedList = [newProperty, ...all];
      saveLocalProperties(updatedList);
      return newProperty;
    }
  },

  // Admin: Update existing property (with Max 5 Active validation if activating)
  async updateProperty(id, propertyData) {
    const all = await this.getAllProperties();
    const existing = all.find(p => p.id === id);

    if (!existing) throw new Error('Property not found');

    // If activating an inactive property, verify limit
    if (!existing.active && propertyData.active) {
      const activeCount = all.filter(p => p.active && p.id !== id).length;
      if (activeCount >= 5) {
        throw new Error('Maximum of 5 active properties allowed. Please deactivate or delete an existing property before adding another.');
      }
    }

    const updatedProperty = {
      ...existing,
      ...propertyData,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('properties')
        .update(updatedProperty)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const updatedList = all.map(p => p.id === id ? updatedProperty : p);
      saveLocalProperties(updatedList);
      return updatedProperty;
    }
  },

  // Admin: Toggle active status
  async toggleActiveStatus(id) {
    const all = await this.getAllProperties();
    const target = all.find(p => p.id === id);
    if (!target) throw new Error('Property not found');

    const newStatus = !target.active;
    return this.updateProperty(id, { active: newStatus });
  },

  // Admin: Delete property
  async deleteProperty(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } else {
      const all = getLocalProperties();
      const filtered = all.filter(p => p.id !== id);
      saveLocalProperties(filtered);
      return true;
    }
  }
};

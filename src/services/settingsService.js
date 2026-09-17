import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEFAULT_SETTINGS } from '../data/initialData';

const SETTINGS_LOCAL_KEY = 'apex_estates_settings';

const getLocalSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_LOCAL_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading localStorage settings:', e);
  }
  return DEFAULT_SETTINGS;
};

const saveLocalSettings = (settings) => {
  localStorage.setItem(SETTINGS_LOCAL_KEY, JSON.stringify(settings));
};

export const settingsService = {
  // Public & Admin: Fetch site settings
  async getSettings() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error || !data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...data };
    } else {
      return getLocalSettings();
    }
  },

  // Admin: Update site settings
  async updateSettings(newSettings) {
    const updated = {
      ...DEFAULT_SETTINGS,
      ...newSettings,
      id: 'default',
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(updated)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      saveLocalSettings(updated);
      return updated;
    }
  }
};

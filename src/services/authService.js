import { supabase, isSupabaseConfigured } from '../lib/supabase';

const MOCK_AUTH_KEY = 'apex_estates_admin_session';

export const authService = {
  // Login with Email & Password
  async login(email, password) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } else {
      // Demo authentication mode
      if (email.trim() && password.length >= 4) {
        const session = {
          user: {
            id: 'demo-admin-id',
            email: email,
            role: 'admin'
          },
          token: 'demo-token-' + Date.now()
        };
        localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(session));
        return session;
      } else {
        throw new Error('Invalid credentials. Password must be at least 4 characters.');
      }
    }
  },

  // Logout admin
  async logout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(MOCK_AUTH_KEY);
  },

  // Get current user / session state
  async getCurrentUser() {
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } else {
      const sessionStr = localStorage.getItem(MOCK_AUTH_KEY);
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          return session.user;
        } catch (e) {
          return null;
        }
      }
      return null;
    }
  },

  // Check if authenticated
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return Boolean(user);
  }
};

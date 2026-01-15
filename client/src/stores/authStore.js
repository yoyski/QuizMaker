import { create } from 'zustand';
import api from '@/lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  isInitialLoad: true, // NEW: Track if it's the first load

  signup: async (name, email, password) => {
    try {
      await api.post("/auth/signup", { name, email, password });
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/me");
      set({ 
        user: res.data.user, 
        isAuthenticated: true, 
        loading: false,
        isInitialLoad: false // No longer initial load
      });
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false,
        isInitialLoad: false // No longer initial load
      });
    }
  }
}));
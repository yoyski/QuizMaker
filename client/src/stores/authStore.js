import { create } from 'zustand';
import api from '@/lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

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
      console.log("✅ Login success:", res.data.user);
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  },

  logout: async () => {
    console.log("🚪 Logout called");
    try {
      await api.post("/auth/logout");
      console.log("✅ Logout API success");
    } catch (err) {
      console.error("❌ Logout API failed:", err);
    } finally {
      console.log("🔄 Clearing auth state");
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    console.log("🔍 Checking auth...");
    try {
      const res = await api.get("/auth/me");
      console.log("✅ Auth check passed:", res.data.user);
      set({ user: res.data.user, isAuthenticated: true, loading: false });
    } catch (error) {
      console.log("❌ Auth check failed - no valid token");
      set({ user: null, isAuthenticated: false, loading: false });
    }
  }
}));
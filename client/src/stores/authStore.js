import { create } from 'zustand';
import api from '@/lib/api'; // use the instance

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
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ user: null, isAuthenticated: false });
    } catch (err) {
      console.error("Logout failed:", err);
      throw err;
    }
  },

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data.user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
      console.error("Auth check failed:", error);
    }
  }
}));
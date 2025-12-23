import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  signup: async (name, email, password) => {
    await axios.post("api/auth/signup", { name, email, password });
  },

  login: async (email, password) => {
    const res = await axios.post("api/auth/login", { email, password }, { withCredentials: true });
    set({ user: res.data.user, isAuthenticated: true });
  },

  logout: async () => {
    await axios.post("api/auth/logout", {}, { withCredentials: true });
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const res = await axios.get("api/auth/me", { withCredentials: true });
      set({ user: res.data.user, isAuthenticated: true, loading: false });

    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
      console.error("Auth check failed:", error);
    }
  }

}))
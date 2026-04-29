import { create } from "zustand";
import api from "@/lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  isInitialLoad: true,

  // ✅ SIGNUP
  signup: async (name, email, password) => {
    try {
      await api.post("/auth/signup", { name, email, password });
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  },

  // ✅ LOGIN (FIXED)
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await api.post("/auth/login", { email, password });

      set({
        user: res.data.user,
        isAuthenticated: true,
        loading: false,
        isInitialLoad: false,
      });
    } catch (err) {
      console.error("Login failed:", err);

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        isInitialLoad: false,
      });

      throw err;
    }
  },

  // ✅ LOGOUT (FIXED)
  logout: async () => {
    set({ loading: true });

    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        isInitialLoad: false,
      });
    }
  },

  // ✅ AUTH CHECK (FIXED CORE ISSUE)
  checkAuth: async () => {
    set({ loading: true }); // 🔥 IMPORTANT FIX

    try {
      const res = await api.get("/auth/me");

      set({
        user: res.data.user,
        isAuthenticated: true,
        loading: false,
        isInitialLoad: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        isInitialLoad: false,
      });
    }
  },
}));
// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // fallback for dev
  withCredentials: true, // needed if using cookies
});

export default api;
// src/Api/globalapi.js
import axios from "axios";

let store; // Placeholder to hold Redux store after injection

// 👇 Function to inject the Redux store into this module
export const injectStore = (_store) => {
  store = _store;
};

// ✅ Create axios instance with baseURL
const api = axios.create({
  baseURL: "http://localhost:8080", // Make sure this is correct
});

// ✅ Interceptor to attach token from Redux store
api.interceptors.request.use(
  (config) => {
    const token = store?.getState()?.auth?.token; // 🔐 Get token from store
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

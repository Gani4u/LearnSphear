
import axios from "axios";
import { logout } from "../store/AuthSlice";
import { useNavigate } from "react-router-dom";

let store;


export const injectStore = (_store) => {
  store = _store;
};


const api = axios.create({
  baseURL: "http://localhost:8080", 
});

api.interceptors.request.use(
  (config) => {
    const token = store?.getState()?.auth?.token; //
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response && error.response.status === 401) {
     
      store.dispatch(logout()); 
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      window.location.href = "/login?message=Your session expired. Please login again.";
    }
    return Promise.reject(error);
  }
);

export default api;

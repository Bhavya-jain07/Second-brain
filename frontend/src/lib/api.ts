import axios from "axios";

// In development this falls back to localhost. For a deployed frontend,
// set VITE_API_URL in your hosting provider's environment variables to
// your deployed backend's URL (e.g. https://your-backend.onrender.com/api/v1).
export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const api = axios.create({ baseURL: BACKEND_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// If the token expires or is invalid, bounce back to sign in.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(err);
  }
);

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor to attach auth tokens if available, and log in development
apiClient.interceptors.request.use(
  (config) => {
    // If running in browser and token is stored in localStorage / cookies
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful handling of network errors / offline backend
    if (error.code === "ECONNABORTED" || !error.response) {
      console.warn("Backend API is currently unreachable. Operating in resilient fallback mode.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

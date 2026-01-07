import axios from "axios";

const api = axios.create({
  baseURL: "http://51.20.82.201:8080/",
  withCredentials: true, // safe even if not used
});

// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ❗ IMPORTANT:
    // DO NOT set Content-Type here.
    // Axios will automatically set:
    // - application/json for normal requests
    // - multipart/form-data with boundary for FormData

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

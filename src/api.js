import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || " https://real-backend-0rg4.onrender.com").replace(/\/$/, ""),
  headers: { "Content-Type": "application/json" },
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("crave-token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  me: () => api.get("/auth/me"),
  login: (credentials) => api.post("/auth/login", credentials),
  register: (details) => api.post("/auth/register", details)
};

export const foodApi = {
  list: (params = {}) => api.get("/foods", { params }),
  get: (id) => api.get(`/foods/${id}`),
  create: (food) => api.post("/foods", food),
  update: (id, food) => api.put(`/foods/${id}`, food),
  remove: (id) => api.delete(`/foods/${id}`),
  recommendations: (params = {}) => api.get("/foods/recommendations", { params }),
  health: () => api.get("/health")
};

export const orderApi = {
  create: (order) => api.post("/orders", order),
  list: () => api.get("/orders"),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status })
};

export function getApiError(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED") return "The API took too long to respond. Please try again.";
  if (!error.response) return "Cannot connect to the backend. Check that the deployed API is awake and the API URL is correct.";
  return "Something went wrong. Please try again.";
}

export default api;
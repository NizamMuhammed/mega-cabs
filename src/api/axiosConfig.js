import axios from "axios";
import { message } from "antd";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Add this line
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error("Session expired. Please login again.");
          localStorage.clear();
          window.location.href = "/login";
          break;
        case 403:
          message.error("Access denied. You don't have permission for this action.");
          window.location.href = "/";
          break;
        default:
          message.error(error.response.data.message || "An error occurred");
      }
    } else {
      message.error("Network error occurred");
    }
    return Promise.reject(error);
  }
);

export default api;

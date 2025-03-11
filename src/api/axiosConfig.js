import axios from "axios";
import { message } from "antd";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Add this line
  timeout: 5000, // Add timeout
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
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", error.response?.data);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (error.response.data?.message?.includes("expired")) {
            localStorage.clear();
            message.error("Your session has expired. Please login again.");
          } else {
            message.error("Session expired. Please login again.");
          }
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
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network Error - Server may be down");
      message.error("Network error occurred");
      // Implement retry logic here if needed
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Your backend URL
  headers: {
    "Content-Type": "application/json",
    // You may have other headers like Authorization
  },
});

// Add an interceptor to include the JWT token in each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  // only add the token if the user is already logged in.
  if (token && config.url !== "/api/v1/auth/register") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

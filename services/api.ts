import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific error cases here
    if (error.response?.status === 404) {
      return Promise.reject(new Error("Resource not found"));
    }
    return Promise.reject(error);
  }
);

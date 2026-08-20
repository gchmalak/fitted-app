import axios from "axios";
import { error } from "console";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    withCredentials:true

});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // network handling error
    if (!error.response) {
      return Promise.reject(
        new Error("Network error, Please check your internet connection")
      );
    }

    // server response error
    const errorMessage =
      error.response.data?.error ||
      error.response.data?.message ||
      "An unexpected error occurred";

    return Promise.reject(new Error(errorMessage));
  }
);

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
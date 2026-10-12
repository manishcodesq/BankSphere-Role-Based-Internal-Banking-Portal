import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "" : "https://banksphere-role-based-internal-banking.onrender.com");

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const googleAuthUrl = `${API_BASE_URL}/auth/google`;

export default API;

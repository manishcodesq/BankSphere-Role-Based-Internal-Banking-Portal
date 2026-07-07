import axios from "axios";

const API = axios.create({
   baseURL: "https://banksphere-role-based-internal-banking.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

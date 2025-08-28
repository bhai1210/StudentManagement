import axios from "axios";
import { getToken } from "./token";

console.log("ENV VAR:", process.env.REACT_APP_API_BASE_URL);

const api = axios.create({
  baseURL: "https://student-management-backend-node-rd8.vercel.app",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

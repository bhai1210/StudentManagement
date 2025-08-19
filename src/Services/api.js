import axios from 'axios'
import { getToken } from './token'

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  withCredentials: false,
})

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
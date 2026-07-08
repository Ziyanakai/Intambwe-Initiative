import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

const api = axios.create({
  baseURL: 'https://intambwe-initiative-production.up.railway.app',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

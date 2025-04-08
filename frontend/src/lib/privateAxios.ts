import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const privateAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ✅ 요청 인터셉터에 토큰 자동 첨부
privateAxios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default privateAxios;

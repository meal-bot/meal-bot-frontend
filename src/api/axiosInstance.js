import axios from 'axios';
import { getToken } from '../features/auth/utils/auth';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청마다 localStorage의 JWT 토큰을 Authorization 헤더에 자동 삽입
// 토큰이 없으면 (비로그인) 헤더를 추가하지 않음
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

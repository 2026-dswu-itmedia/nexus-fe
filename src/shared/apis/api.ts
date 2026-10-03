import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 서버가 발급한 visitor_session 쿠키를 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

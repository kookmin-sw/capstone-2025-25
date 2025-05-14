import axios from 'axios';
import { ENDPOINTS } from '@/api/endpoints.ts';
import { BASE_URL, GPT_BASE_URL } from '@/constants/auth.ts';
import { getCookie, setCookie } from '@/utils/cookie.ts';
import { useAuthStore } from '@/store/authStore.ts';

/*
백엔드 API 클라이언트
TODO: 백엔드 API 주소 나오면 설정 예정
*/
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/*
GPT API 클라이언트
*/
export const gptClient = axios.create({
  baseURL: GPT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
백엔드 API 요청 인터셉터 설정 (토큰 추가, 에러 처리 등)
TODO: 추후에 토큰 로직 결정되면 그에 맞게 수정 필요.
*/
apiClient.interceptors.request.use((config) => {
  const token = getCookie('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
/*
백엔드 API 응답 인터셉터 설정 (오류 처리 등)
TODO: 추후 인증 관련 로직 결정되면 그에 맞게 수정 필요.
refreshToken 처리 로직 추가
*/

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      console.error('originalRequest 없음 (CORS or 네트워크 오류?)');
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;

    if (isUnauthorized && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          {}, // refreshToken body에 안 넣음
          { withCredentials: true },
        );

        const newAccessToken = res.data?.content?.accessToken;
        if (!newAccessToken) throw new Error('accessToken 없음');

        setCookie('accessToken', newAccessToken);
        const { setToken, setTokenValidity } = useAuthStore.getState();
        setToken(newAccessToken);
        setTokenValidity(true);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        const { setToken, setTokenValidity } = useAuthStore.getState();
        setToken(null);
        setTokenValidity(false);
        document.cookie = 'accessToken=; path=/; max-age=0';
        document.cookie = 'refreshToken=; path=/; max-age=0';
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

/*
GPT API 요청 인터셉터 설정
TODO: 추후 인증 관련 로직 결정되면 그에 맞게 수정 필요.
*/
gptClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/*
GPT API 응답 인터셉터 설정
TODO: 추후 인증 관련 로직 결정되면 그에 맞게 수정 필요.
*/
gptClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // GPT API 오류 처리
    console.error('GPT API Error:', error);
    return Promise.reject(error);
  },
);

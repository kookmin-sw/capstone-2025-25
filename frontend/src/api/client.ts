import axios from 'axios';
import { ENDPOINTS } from '@/api/endpoints.ts';
import { BASE_URL, GPT_BASE_URL } from '@/constants/auth.ts';
import { getCookie, setCookie } from '@/utils/cookie.ts';
import { useAuthStore } from '@/store/authStore.ts';
import { toast } from 'sonner';

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

let refreshPromise: Promise<string> | null = null;
let refreshFailed = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { isTokenValid, setToken, setTokenValidity } =
      useAuthStore.getState();

    const accessToken = getCookie('accessToken');
    const shouldRetry =
      (!accessToken || !isTokenValid || error.response?.status === 401) &&
      !originalRequest._retry &&
      !refreshFailed;

    if (shouldRetry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) {
          console.error('refreshToken 없음');
          setToken(null);
          setTokenValidity(false);
          toast.error('로그인이 필요합니다.');
          refreshFailed = true;
          return Promise.reject(error);
        }

        refreshPromise = axios
          .post(
            `${BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            { refreshToken },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          )
          .then((res) => {
            const newAccessToken = res.data?.content?.accessToken;
            if (!newAccessToken) throw new Error('accessToken 없음');

            setCookie('accessToken', newAccessToken);
            setToken(newAccessToken);
            setTokenValidity(true);

            return newAccessToken;
          })
          .catch((err) => {
            console.error('토큰 재발급 실패:', err);
            setToken(null);
            setTokenValidity(false);
            toast.error('로그인이 필요합니다.');
            refreshFailed = true;
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const newAccessToken = await refreshPromise;

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        return Promise.reject(err);
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

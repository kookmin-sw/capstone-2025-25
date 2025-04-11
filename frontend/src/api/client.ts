import axios from 'axios';
import { ENDPOINTS } from '@/api/endpoints.ts';
import { BASE_URL, GPT_BASE_URL } from '@/constants/auth.ts';
/*
백엔드 API 클라이언트
TODO: 백엔드 API 주소 나오면 설정 예정
*/
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
apiClient.interceptors.request.use(
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
백엔드 API 응답 인터셉터 설정 (오류 처리 등)
TODO: 추후 인증 관련 로직 결정되면 그에 맞게 수정 필요.
refreshToken 처리 로직 추가
*/
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          {},
          {
            withCredentials: true,
          },
        );

        const newAccessToken = res.data?.content?.accessToken;
        if (!newAccessToken) throw new Error('재발급 실패: accessToken 없음');

        localStorage.setItem('token', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (reissueError) {
        console.error('토큰 재발급 실패:', reissueError);
        localStorage.removeItem('token');
        window.location.href = '/login';
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

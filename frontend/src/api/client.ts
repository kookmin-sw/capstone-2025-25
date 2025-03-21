import axios from 'axios';

/* 
백엔드 API 클라이언트
TODO: 백엔드 API 주소 나오면 설정 예정
*/
export const apiClient = axios.create({
  baseURL: 'https://backend-server.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 
GPT API 클라이언트
현재는 테스트 GPT API 서버인 http://3.36.179.66로 설정
*/
export const gptClient = axios.create({
  baseURL: 'http://3.36.179.66',
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
*/
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
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

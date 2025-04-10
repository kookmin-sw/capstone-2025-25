import { useEffect } from 'react';
import { fetchMyInfo } from '../api/auth';
import { login } from '../services/loginService.ts';

export const useAuthInit = () => {
  useEffect(() => {
    fetchMyInfo()
      .then(({ token }) => {
        if (token) login(token);
      })
      .catch(() => {
        console.log('자동 로그인 실패');
      });
  }, []);
};

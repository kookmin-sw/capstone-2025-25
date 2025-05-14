import { useNavigate } from 'react-router';
import { useCallback } from 'react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export const useWithdrawAuth = () => {
  const navigate = useNavigate();

  const withdraw = useCallback(async () => {
    try {
      await authService.withdraw();
      authService.logout();
      toast.success('회원탈퇴가 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      toast.error('회원탈퇴에 실패했습니다.');
    }
  }, [navigate]);

  return { withdraw };
};

import { useNavigate } from 'react-router';
import { useCallback } from 'react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import {showToast} from "@/components/common/Toast.tsx";

export const useWithdrawAuth = () => {
  const navigate = useNavigate();

  const withdraw = useCallback(async () => {
    try {
      await authService.withdraw();
      authService.logout();
      showToast('success','회원탈퇴가 완료되었습니다.')
      // toast.success('회원탈퇴가 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      showToast('error','회원탈퇴에 실패했습니다.')
      // toast.error('회원탈퇴에 실패했습니다.');
    }
  }, [navigate]);

  return { withdraw };
};

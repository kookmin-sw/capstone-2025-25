import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import useExchangeCodeForToken from '@/hooks/useExchangeCodeForToken.ts';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const { exchangeCodeForTokenMutation, isPending, error } =
    useExchangeCodeForToken();

  useEffect(() => {
    if (!code) {
      navigate('/login');
      return;
    }

    exchangeCodeForTokenMutation(code, {
      onSuccess: () => navigate('/matrix'),
      onError: (error) => {
        console.error('토큰 발급 실패:', error);
        navigate('/login');
      },
    });
  }, [code, exchangeCodeForTokenMutation, navigate]);

  return (
    <p className="text-center mt-10">
      {error
        ? `토큰 발급 실패: ${error.message}`
        : isPending
          ? '로그인 처리 중입니다...'
          : // TODO : 별도의 UI 처리 필요
            ''}
    </p>
  );
}

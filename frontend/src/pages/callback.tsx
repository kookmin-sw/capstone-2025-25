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
      onSuccess: (data) => {
        if (data.content.isRegistered === false) {
          navigate('/onboarding');
        } else {
          navigate('/today');
        }
      },
      onError: (error) => {
        console.error('토큰 발급 실패:', error);
        navigate('/login');
      },
    });
  }, [code, exchangeCodeForTokenMutation, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      {error ? (
        <p className="text-center text-red-500 text-lg">
          토큰 발급 실패: {error.message}
        </p>
      ) : isPending ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
          <p className="text-center text-gray-600">
            버블이가 로그인 처리 중입니다
          </p>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

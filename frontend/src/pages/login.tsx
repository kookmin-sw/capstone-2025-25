import kakao from '@/assets/kakao.svg';
import naver from '@/assets/naver.svg';
import Bubble from '@/assets/bubble-character.svg';
import Logo from '@/assets/logo.svg';
import { useResponsive } from '@/hooks/use-mobile';

export default function LoginPage() {
  const { isMobile } = useResponsive();

  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/naver`;
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-[#F0F0F5] px-4">
      <div
        className={`flex ${
          isMobile ? 'flex-col ' : 'flex-row gap-20'
        } items-center justify-center`}
      >
        {isMobile && (
          <>
            <div>
              <p>머릿속을 맑게, 오늘을 명확하게!</p>
              <img src={Logo} alt="logo" />
            </div>
          </>
        )}
        <div>
          <img
            src={Bubble}
            width={isMobile ? 300 : 500}
            alt="bubble"
            // className={isMobile ? 'mx-auto' : ''}
          />
        </div>

        <div className="flex flex-col justify-center   w-full">
          {!isMobile && (
            <>
              <div className="text-2xl font-bold mb-6">
                <h1>머릿속을 맑게,</h1>
                <h1>오늘을 명확하게!</h1>
              </div>
              <div className="mb-6 text-sm text-[#444]">
                <p>
                  해야 할 일은 많은데, 뭐부터 할지 막막할 때.
                  <br />
                  버블팝에서 생각을 정리하고, 가장 중요한 것에 집중하세요.
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col w-full gap-4">
            <button
              onClick={handleKakaoLogin}
              className="w-full flex items-center justify-between gap-2 bg-[#FEE502] text-[#3C1E1E] px-6 py-4 rounded-md hover:bg-[#FFDC3C]"
            >
              <img src={kakao} alt="kakao" className="w-6 h-6" />
              <p className="text-[16px] mx-auto">카카오로 시작하기</p>
              <div className="h-5 w-5" />
            </button>

            <button
              onClick={handleNaverLogin}
              className="w-full flex items-center justify-between gap-2 bg-[#04C759] text-white px-6 py-4 rounded-md hover:bg-[#02b350]"
            >
              <img src={naver} alt="naver" className="w-6 h-6" />
              <p className="text-[16px] mx-auto">네이버로 시작하기</p>
              <div className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import kakao from '@/assets/kakao.svg';
import naver from '@/assets/naver.svg';
import Bubble from '@/assets/bubble-character.svg';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/naver`;
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div>
        <img src={Bubble} width="500" alt="bubble" />
      </div>
      <div className=" flex-col justify-center items-center">
        <div className="text-2xl font-bold mb-6">
          <h1>머릿속을 맑게,</h1>
          <h1>오늘을 명확하게!</h1>
        </div>
        <div className="mb-6">
          <p>
            해야 할 일은 많은데, 뭐부터 할지 막막할 때.
            <br />
            버블팝에서 생각을 정리하고, 가장 중요한 것에 집중하세요.
          </p>
        </div>

        <div className="flex flex-col max-w-[345px] w-full gap-4">
          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-between gap-2 bg-[#FEE500] text-[#3C1E1E] px-6 py-4 rounded-md hover:bg-[#FFDC3C]"
          >
            <img src={kakao} alt="kakao" className="w-6 h-6" />
            <p className="text-[16px]">카카오로 시작하기</p>

            <div className="h-5 w-5"></div>
          </button>

          <button
            onClick={handleNaverLogin}
            className="w-full flex items-center justify-between gap-2 bg-[#03C75A] text-white px-6 py-4 rounded-md hover:bg-[#02b350]"
          >
            <img src={naver} alt="naver" className="w-6 h-6" />
            <p className="text-[16px]">네이버로 시작하기</p>
            <div className="h-5 w-5"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

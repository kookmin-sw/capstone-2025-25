import kakao from '@/assets/kakao.svg';
import naver from '@/assets/naver.svg';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/naver`;
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[url('src/assets/hero-section.png')] bg-cover bg-cente h-screen">
      <div className="text-2xl font-bold mb-6 text-center">
        <h1>머릿속이 복잡할수록</h1>
        <h1>정리는 더 쉬워야하니까</h1>
      </div>
      <div className="text-center mb-6">
        <p>
          해야 할 일은 많은데, 뭐부터 할지 막막할 때.
          <br />
          AHZ 에서 생각을 정리하고, 가장 중요한 것에 집중하세요.
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
  );
}

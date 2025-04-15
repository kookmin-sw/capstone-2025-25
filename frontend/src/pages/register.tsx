export default function RegisterPage() {
  const handleKakao = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleNaver = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/naver`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>

      <div className="grid gap-4">
        <button
          onClick={handleKakao}
          className="w-full flex items-center justify-center gap-2 bg-[#FEE500] text-[#3C1E1E] py-2 rounded-md hover:bg-[#FFDC3C]"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.06 2 11c0 2.77 1.41 5.26 3.64 6.9l-1 3.67c-.14.52.43.96.91.68l4.48-2.52c.63.1 1.28.15 1.97.15 5.52 0 10-4.06 10-9s-4.48-9-10-9z" />
          </svg>
          카카오로 가입
        </button>

        <button
          onClick={handleNaver}
          className="w-full flex items-center justify-center gap-2 bg-[#03C75A] text-white py-2 rounded-md hover:bg-[#02b350]"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16v16H4z" fill="none" />
            <path
              d="M10.09 10.72L13.3 15h2.16V9h-2v4.22L10.91 9H8.75v6h2v-4.28z"
              fill="currentColor"
            />
          </svg>
          네이버로 가입
        </button>
      </div>
    </div>
  );
}

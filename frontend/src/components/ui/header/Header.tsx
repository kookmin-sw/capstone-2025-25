import { useAuthStore } from '@/store/authStore';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Header() {
  const { isAuthenticated, setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      setToken(null);
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="px-7.5 py-2.5 h-[50px] flex items-center justify-between sticky top-0 w-full bg-white border-b border-b-[#E5E5E5] z-10 ">
      <div className="flex-1 max-w-md">BUBBLE_POP</div>
      <div className="flex items-center gap-[20px]">
        <div></div>

        {isAuthenticated && (
          <>
            <button className="cursor-pointer">
              <Bell size={20} className="text-blue" fill="#7098FF" />
            </button>
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#D3EE17] border border-blue cursor-pointer"></div>
          </>
        )}

        <button
          className="px-6 py-[6px] bg-blue text-white rounded-lg font-semibold cursor-pointer"
          onClick={handleAuthAction}
        >
          {isAuthenticated ? '로그아웃' : '로그인'}
        </button>
      </div>
    </header>
  );
}

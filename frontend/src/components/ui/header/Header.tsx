import { useAuthStore } from '@/store/authStore';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router';
import Logo from '@/assets/logo.svg';
import { usePomodoroStore } from '@/store/pomodoro';
import usePomodoroControl from '@/hooks/usePomodoroControl';
import { authService } from '@/services/authService.ts';

export default function Header() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  usePomodoroControl();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // setToken(null);
      authService.logout();
    } else {
      navigate('/login');
    }
  };

  const currentId = usePomodoroStore((s) => s.id);
  const currentElapsedTime = usePomodoroStore((s) => s.elapsedTime);

  const TOTAL_SECONDS = 25 * 60;
  const remaining = Math.max(TOTAL_SECONDS - currentElapsedTime, 0);

  const format = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <header className="px-7.5 py-2.5 h-[50px] flex items-center justify-between sticky top-0 w-full bg-gray-scale-200 border-b border-b-white z-100 ">
      <div className="flex-1 max-w-md">
        <img src={Logo} />
      </div>
      <div className="flex items-center gap-[20px]">
        <div></div>
        {currentId && (
          <div className="text-[#7098FF] font-medium bg-blue-2 border rounded-4xl border-blue px-4 py-[6px] text-[20px] h-9 w-[87px] flex justify-center items-center">
            {format(remaining)}
          </div>
        )}

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

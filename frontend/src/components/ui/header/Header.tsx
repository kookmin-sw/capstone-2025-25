import { useAuthStore } from '@/store/authStore';
import { Bell, Info, Settings, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router';
import Logo from '@/assets/logo.svg';
import { usePomodoroStore } from '@/store/pomodoro';
import usePomodoroControl from '@/hooks/usePomodoroControl';
import { authService } from '@/services/authService.ts';
import WithdrawalModal from "@/components/ui/Modal/WithdrawalModal.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Bubble from '@/assets/bubble-character.svg';

export default function Header() {
  const { token, isTokenValid } = useAuthStore();
  const isAuthenticated = !!token && isTokenValid;

  const navigate = useNavigate();
  usePomodoroControl();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // setToken(null);
      authService.logout();
      localStorage.removeItem('pomodoro-state')
    } else {
      navigate('/login');
    }
  };

  const navigateToToday = () => {
    if (location.pathname !== '/today') {
      navigate('/today');
    }
  };
  const navigateToIntro = () => {
    window.open('https://cheerful-perspective-141321.framer.app/', '_blank');
  };

  const currentId = usePomodoroStore((s) => s.id);
  const currentElapsedTime = usePomodoroStore((s) => s.elapsedTime);

  const TOTAL_SECONDS = 25 * 60;
  const remaining = Math.max(TOTAL_SECONDS - currentElapsedTime, 0);

  const format = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const moveToPomododro = () => {
    if (location.pathname !== '/today') {
      navigate('/today');
    }
  };
  return (
    <header className="px-4 py-[7px] md:px-12 h-[50px] flex items-center justify-between sticky top-0 w-full bg-gray-scale-200 border-b border-b-white z-50 ">
      <div className="flex-1 max-w-md">
        <img src={Logo} onClick={navigateToToday} className="cursor-pointer" />
      </div>
      <div className="flex items-center gap-[20px]">
        <div></div>
        {currentId && (
          <div
            onClick={moveToPomododro}
            className="cursor-pointer text-[#7098FF] font-medium bg-blue-2 border rounded-4xl border-blue px-4  text-[16px] h-[31px] w-[75px] flex justify-center items-center"
          >
            {format(remaining)}
          </div>
        )}

        {isAuthenticated && (
          <>
            <button className="cursor-pointer">
              <Bell size={20} className="text-blue" fill="#7098FF" />
            </button>

            <Popover>
              <PopoverTrigger asChild>
                {/*<div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#D3EE17] border border-blue cursor-pointer"></div>*/}
                <div className="w-6 h-6 cursor-pointer">
                  <img src={Bubble} alt="bubble" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-1 mr-4 md:hidden z-100">
                <div className="py-1">
                  <button
                    onClick={navigateToIntro}
                    className="rounded-[8px] w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 outline-none cursor-pointer"
                  >
                    <Info size={16} />
                    <span>서비스 소개</span>
                  </button>
                  <button
                    onClick={handleAuthAction}
                    className=" rounded-[8px] w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 outline-none cursor-pointer"
                  >
                    {isAuthenticated ? (
                      <>
                        <LogOut size={16} />
                        <span>로그아웃</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={16} />
                        <span>로그인</span>
                      </>
                    )}
                  </button>
                  <WithdrawalModal trigger={
                    <button
                        className=" rounded-[8px] w-[150px] flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 outline-none cursor-pointer"
                    >
                      <Settings size={16} />
                      <span>회원 탈퇴</span>
                    </button>
                  }/>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}

        <button
          className="px-2 py-[3px] w-[90px] h-[31px] text-[16px] bg-blue text-white rounded-lg font-semibold cursor-pointer hidden md:block"
          onClick={handleAuthAction}
        >
          {isAuthenticated ? '로그아웃' : '로그인'}
        </button>
      </div>
    </header>
  );
}

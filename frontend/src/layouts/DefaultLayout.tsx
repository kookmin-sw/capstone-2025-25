import { Outlet } from 'react-router';
import Sidebar from '@/components/ui/sidebar/Sidebar';
import Header from '@/components/ui/header/Header';
// import { useAuthRedirect } from '@/hooks/useAuthRedirect.ts';

export default function DefaultLayout() {
  // useAuthRedirect();
  // TODO : 로그인 서버 원활할 시 주석 제거
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex flex-col w-full h-screen overflow-auto bg-white scrollbar-hide">
        <Header />
        <section className="overflow-auto flex-1">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

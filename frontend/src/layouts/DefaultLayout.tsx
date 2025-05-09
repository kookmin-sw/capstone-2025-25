import { Outlet } from 'react-router';
import Sidebar from '@/components/ui/sidebar/Sidebar';
import Header from '@/components/ui/header/Header';
import BottomBar from '@/components/ui/sidebar/BottomBar';
import clsx from 'clsx';
import { useIsMobile } from '@/hooks/use-mobile.ts';

export default function DefaultLayout() {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-[#F0F0F5] flex flex-col">
      <Header />

      <div className="flex flex-1 p-4 overflow-hidden ">
        <div
          className={clsx(
            'block sticky top-0 self-start h-[calc(100vh-88px)] mr-4 flex-shrink-0 z-50',
            isMobile && 'hidden',
          )}
        >
          <div className="h-full rounded-lg shadow-md overflow-hidden ">
            <Sidebar />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <main className="w-full h-full ">
            <Outlet />
          </main>
        </div>
      </div>

      <div className={clsx(!isMobile && 'hidden')}>
        <BottomBar />
      </div>
    </div>
  );
}

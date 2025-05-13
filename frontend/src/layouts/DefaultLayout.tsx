import { Outlet } from 'react-router';
import Sidebar from '@/components/ui/sidebar/Sidebar';
import Header from '@/components/ui/header/Header';
import BottomBar from '@/components/ui/sidebar/BottomBar';
import { Toaster } from '@/components/ui/sonner';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-[#F0F0F5] flex flex-col">
      <Header />

      <div className="flex flex-1 p-12 gap-9">
        <div className="hidden md:block h-[calc(100vh-136px)] flex-shrink-0 z-10">
          <div className="h-full rounded-lg shadow-md overflow-hidden">
            <Sidebar />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <main className="w-full h-full md:pb-0 pb-16">
            <Outlet />
            <Toaster />
          </main>
        </div>
      </div>

      <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-white z-50">
        <BottomBar />
      </div>
    </div>
  );
}

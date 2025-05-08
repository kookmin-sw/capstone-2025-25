import { Outlet } from 'react-router';
import Sidebar from '@/components/ui/sidebar/Sidebar';
import Header from '@/components/ui/header/Header';

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-[#F0F0F5] flex flex-col">
      <Header />

      <div className="flex flex-1 p-4 overflow-hidden">
        <div className="sticky top-0 self-start h-[calc(100vh-88px)] mr-4 flex-shrink-0">
          <div className="h-full rounded-lg shadow-md overflow-hidden">
            <Sidebar />
          </div>
        </div>

        <div className="flex-1">
          <main className="bg-white rounded-lg shadow-md p-6 min-h-[calc(100vh-88px)]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

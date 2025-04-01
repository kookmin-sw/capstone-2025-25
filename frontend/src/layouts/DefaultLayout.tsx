import { Outlet } from 'react-router';
import Sidebar from '@/components/ui/sidebar/Sidebar';

export default function DefaultLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

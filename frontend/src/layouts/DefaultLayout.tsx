import { Outlet } from 'react-router';
import Sidebar from '@/components/ui/sidebar/Sidebar';
import Header from '@/components/ui/header/Header';

export default function DefaultLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto bg-white">
        <Header />
        <section className="px-10 py-[50px]">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

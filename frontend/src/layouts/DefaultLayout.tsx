import { Outlet } from 'react-router';
import Sidebar from '@/components/ui/sidebar/Sidebar';
import Header from '@/components/ui/header/Header';

export default function DefaultLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex flex-col w-full h-screen overflow-auto bg-white scrollbar-hide">
        <Header />
        <section className="overflow-auto" >
          <Outlet />
        </section>
      </main>
    </div>
  );
}

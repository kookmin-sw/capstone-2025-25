import { Outlet } from 'react-router';
import Sidebar from '@/components/ui/sidebar/Sidebar.tsx';

export default function DefaultLayout() {
  return (
    <div>
      <header>Default header</header>
        <Sidebar />
      <Outlet />
    </div>
  );
}

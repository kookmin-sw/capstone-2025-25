import { Outlet } from 'react-router';
import PriorityMatrix from '@/components/PriorityMatrix/PriorityMatrix.tsx';

export default function DefaultLayout() {
  return (
    <div>
      <header>Default header</header>
      <Outlet />
      <PriorityMatrix />
    </div>
  );
}

import { Outlet } from 'react-router';

export default function DefaultLayout() {
  return (
    <div>
      <header>Default header</header>
      <Outlet />
    </div>
  );
}

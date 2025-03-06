import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div>
      <header>Auth header</header>
      <Outlet />
    </div>
  );
}

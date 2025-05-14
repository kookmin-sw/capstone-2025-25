import { Outlet } from 'react-router';
import { useAuthRedirect } from '@/hooks/useAuthRedirect.ts';

export default function AuthLayout() {
  useAuthRedirect();
  return (
    <div>
      {/*<header>Auth header</header>*/}
      <Outlet />
    </div>
  );
}

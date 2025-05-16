import { Outlet } from 'react-router';
import { useAuthRedirect } from '@/hooks/useAuthRedirect.ts';
import { usePageView } from '@/hooks/usePageView.ts';

export default function AuthLayout() {
  useAuthRedirect();
  usePageView();
  return (
    <div>
      <Outlet />
    </div>
  );
}

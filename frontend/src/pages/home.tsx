import { useAuthRedirect } from '@/hooks/useAuthRedirect';

export default function HomePage() {
  useAuthRedirect();

  return <div>메인 페이지</div>;
}

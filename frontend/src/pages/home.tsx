import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const navigate = useNavigate();

  // 임시로 matrix로 이동하도록 처리
  useEffect(() => {
    navigate('/matrix');
  }, [navigate]);

  return <div>메인 페이지</div>;
}

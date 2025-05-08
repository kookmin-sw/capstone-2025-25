import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/today');
  }, [navigate]);

  return <div>메인 페이지</div>;
}

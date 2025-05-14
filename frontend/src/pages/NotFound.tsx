import { Link } from 'react-router';
import SadBubble from '@/assets/sad-bubble.svg';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div>
        <img src={SadBubble} alt="bubble" />
      </div>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        메인으로 돌아가기
      </Link>
    </div>
  );
}

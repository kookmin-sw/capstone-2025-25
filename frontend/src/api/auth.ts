// api/auth.ts
export async function fetchMyInfo() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include', // ✅ 세션/쿠키 인증 시 꼭 필요!
  });

  if (!res.ok) throw new Error('유저 정보 요청 실패');

  const data = await res.json();
  const authHeader = res.headers.get('authorization'); // 👈 헤더에서 토큰 가져오기

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : undefined;

  return {
    ...data,
    token,
  };
}

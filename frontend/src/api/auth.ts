export async function fetchMyInfo() {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/token`, // 서버에서 로그인 상태 확인 & accessToken 받아오기
    {
      method: 'GET',
      credentials: 'include', // HttpOnly 쿠키 포함
    },
  );

  if (!res.ok) throw new Error('유저 정보 요청 실패');

  const data = await res.json();
  const authHeader = res.headers.get('authorization');

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : undefined;

  return {
    ...data,
    token,
  };
}

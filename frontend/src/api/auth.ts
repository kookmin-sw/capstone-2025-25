export async function fetchMyInfo() {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/token`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );

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

/* 
날짜를 YYYY-MM-DD 형식으로 변환하는 함수
(추후에 날짜 데이터 형식이 바뀐다면 그에 맞게 수정)
*/

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

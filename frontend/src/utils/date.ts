/**
 * 날짜 문자열(YYYY-MM-DD)이 start~end 범위에 있는지 확인합니다.
 * 시간 차이로 오차가 생기지 않도록 모두 자정으로 설정합니다.
 */
export function isWithinRange(
  dateInput: string | Date,
  start: Date,
  end: Date,
): boolean {
  let date: Date;

  if (typeof dateInput === 'string') {
    const [year, month, day] = dateInput.split('-').map(Number);
    date = new Date(year, month - 1, day); // month는 0-based
  } else {
    date = dateInput;
  }

  return date >= start && date <= end;
}

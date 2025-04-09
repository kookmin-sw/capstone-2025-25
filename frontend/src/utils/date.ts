export function isWithinRange(
  dateInput: string | Date,
  start: Date,
  end: Date,
): boolean {
  let date: Date;

  if (typeof dateInput === 'string') {
    const [year, month, day] = dateInput.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = dateInput;
  }

  return date >= start && date <= end;
}

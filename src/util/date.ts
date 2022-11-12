export function formatDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1 + "").padStart(
    2,
    "0"
  )}-${(date.getDate() + "").padStart(2, "0")}`;
}

// example 2022-10-10 00:00:00 <= x < 2022-10-11 00:00:00
export function betweenDate(date: Date) {
  const next = new Date(date.getTime() + 1000 * 60 * 60 * 24);
  return [
    new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`),
    new Date(`${next.getFullYear()}/${next.getMonth() + 1}/${next.getDate()}`),
  ];
}
// 2022-10-01 00:00:00 <= x < 2022-11-01 00:00:00
export function betweenMonth(date: Date) {
  const month = date.getMonth() + 1;
  let nextMonth = 0;
  let nextYear = 0;
  if (month === 12) {
    nextMonth = 1;
    nextYear = date.getFullYear() + 1;
  } else {
    nextMonth = date.getMonth() + 2;
    nextYear = date.getFullYear();
  }
  return [
    new Date(`${date.getFullYear()}/${date.getMonth() + 1}/1`),
    new Date(`${nextYear}/${nextMonth}/1`),
  ];
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1 + "").padStart(
    2,
    "0"
  )}-${(date.getDate() + "").padStart(2, "0")}`;
}

export function betweenDate(date: Date) {
  const next = new Date(date.getTime() + 1000 * 60 * 60 * 24);
  return [
    new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`),
    new Date(`${next.getFullYear()}/${next.getMonth() + 1}/${next.getDate()}`),
  ];
}

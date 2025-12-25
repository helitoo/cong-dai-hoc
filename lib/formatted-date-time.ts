export function fmtDateTime(v: string | Date) {
  const d = new Date(v);

  const time = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });

  const year = d.getFullYear().toString().slice(-2);

  return `${time} ${date}-${year}`;
}

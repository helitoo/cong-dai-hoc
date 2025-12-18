export function getCurrHHMM(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  return `${hours}:${minutes}`;
}

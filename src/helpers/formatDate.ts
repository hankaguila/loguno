export default function formatDate(date: Date): string {
  const yyyy = `${date.getFullYear()}`;
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hour = date.getHours();
  const hh = String(hour % 12 || 12).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const HH = hour >= 12 && hour < 24 ? "PM" : "AM";

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}-${HH}`;
};

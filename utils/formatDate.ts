export function formatDate(iso?: string): string {
  if (!iso) return ""; // or return "–"
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

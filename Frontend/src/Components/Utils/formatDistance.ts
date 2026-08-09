export function formatDistance(
  meters?: number | string | null
): string {
  if (meters === undefined || meters === null || meters === "") return "--";
  const value = typeof meters === "string" ? parseFloat(meters) : meters;
  if (isNaN(value) || value <= 0) return "--";
  const km = value / 1000;
  return km >= 100 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
}

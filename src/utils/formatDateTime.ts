export const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "Unknown";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const getSecurityPosture = (
  score: number | null | undefined,
  savedCount: number,
) => {
  if (savedCount === 0) return "Add passwords to scan";
  if (score == null) return "Unknown";
  if (score >= 85) return "Healthy";
  if (score >= 60) return "Fair";
  return "Needs attention";
};

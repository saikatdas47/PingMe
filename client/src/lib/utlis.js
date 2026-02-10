export function formatMsgTime(date) {
  if (!date) return ""; // optional safety
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
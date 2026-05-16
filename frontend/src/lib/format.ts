export const fmt = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const fmtShort = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
export const fmtLong = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
// export const fmtRelative = (d: string | Date) => {
//   const now = new Date();
//   const date = new Date(d);
//   const diff = now.getTime() - date.getTime();
//   const seconds = Math.floor(diff / 1000);
//   if (seconds < 60) return "Just now";
//   const intervals: [number, string][] = [
//     [60, "second"],
//     [60, "minute"],
//     [24, "hour"],
//     [7, "day"],
//     [4.34524, "week"],
//     [12, "month"],
//     [Number.POSITIVE_INFINITY, "year"],
//   ];
//   let count = seconds;
//   for (const [interval, label] of intervals) {
//     if (count < interval) {
//       return `${Math.floor(count)} ${label}${Math.floor(count) !== 1 ? "s" : ""} ago`;
//     }
//     count /= interval;
//   }
//   return fmt(date);
// }

export const calcReadingTime = (html: string) => {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

export const generateSlug = (title: string) =>
  `${title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 180)}-${Date.now().toString(36)}`;

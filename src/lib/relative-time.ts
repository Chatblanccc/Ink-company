export function relativeTime(date: Date | string, locale: "zh" | "en"): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) {
    return locale === "zh" ? "刚刚" : "Just now";
  }
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return locale === "zh" ? `${diffMinutes}分钟前` : `${diffMinutes} min ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return locale === "zh" ? `${diffHours}小时前` : `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return locale === "zh" ? `${diffDays}天前` : `${diffDays}d ago`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return locale === "zh" ? `${weeks}周前` : `${weeks}w ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return locale === "zh" ? `${months}个月前` : `${months}mo ago`;
  }
  const years = Math.floor(diffDays / 365);
  return locale === "zh" ? `${years}年前` : `${years}y ago`;
}

"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

type Props = {
  slug: string;
  initialSeconds: number;
  locale: "zh" | "en";
};

function formatTotalReadTime(seconds: number, locale: "zh" | "en"): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) {
    return locale === "zh" ? `${minutes} 分钟` : `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return locale === "zh" ? `${hours} 小时` : `${hours} hr`;
  }
  return locale === "zh" ? `${hours} 小时 ${mins} 分钟` : `${hours} hr ${mins} min`;
}

export function ArticleReadTimeDisplay({ slug, initialSeconds, locale }: Props) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/articles/${slug}/read-time`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setTotalSeconds(data.totalSeconds ?? 0);
        }
      } catch {
        // silently ignore — display keeps last known value
      }
    }

    // First poll shortly after mount so the very first heartbeat (at 15s) is visible quickly
    const initial = setTimeout(fetchStats, 8_000);
    // Then poll every 20s while the reader is on the page
    const interval = setInterval(fetchStats, 20_000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [slug]);

  return (
    <span className="flex items-center gap-[6px] text-[12px] font-mono text-[#666]">
      <Clock size={13} strokeWidth={1.6} />
      {totalSeconds > 0
        ? locale === "zh"
          ? `累计阅读 ${formatTotalReadTime(totalSeconds, "zh")}`
          : `${formatTotalReadTime(totalSeconds, "en")} total read`
        : locale === "zh"
          ? "暂无阅读数据"
          : "No reads yet"}
    </span>
  );
}

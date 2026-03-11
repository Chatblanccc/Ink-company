"use client";

import { useEffect, useRef } from "react";

type Props = { slug: string };

const HEARTBEAT_INTERVAL = 15_000; // send a ping every 15 seconds
const API_PATH = (slug: string) => `/api/articles/${slug}/read-time`;

export function ArticleReadTracker({ slug }: Props) {
  const startRef = useRef<number | null>(null);   // timestamp when current reading session began
  const slugRef = useRef(slug);                    // stable ref to slug across re-renders

  useEffect(() => {
    slugRef.current = slug;
  }, [slug]);

  useEffect(() => {
    /* ── Send accumulated seconds to the API ── */
    function flush() {
      if (startRef.current === null) return;
      const elapsed = Math.round((Date.now() - startRef.current) / 1000);
      startRef.current = null;
      if (elapsed <= 0) return;

      // Use sendBeacon for reliable delivery on page unload
      const url = API_PATH(slugRef.current);
      const body = JSON.stringify({ seconds: elapsed });
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
      }
    }

    /* ── Handle tab visibility ── */
    function onVisibilityChange() {
      if (document.hidden) {
        // Tab hidden / user switched away — flush current session
        flush();
      } else {
        // Tab visible again — start a new session
        startRef.current = Date.now();
      }
    }

    /* ── Start tracking ── */
    startRef.current = Date.now();
    document.addEventListener("visibilitychange", onVisibilityChange);

    /* ── Heartbeat: flush every 15s so data is saved even on very long reads ── */
    const interval = setInterval(() => {
      if (!document.hidden && startRef.current !== null) {
        flush();
        startRef.current = Date.now(); // restart the session timer
      }
    }, HEARTBEAT_INTERVAL);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(interval);
      flush(); // flush remaining time on unmount
    };
  }, []);

  // Renders nothing — pure side-effect component
  return null;
}

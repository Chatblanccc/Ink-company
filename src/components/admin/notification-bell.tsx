"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Bell, Inbox, ArrowRight } from "lucide-react";
import { type AdminLocale } from "@/lib/admin-i18n";
import { relativeTime } from "@/lib/relative-time";

type Inquiry = {
  id: string;
  name: string;
  company: string;
  email: string;
  market: string;
  message: string;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  packaging:  "#16a34a",
  labels:     "#2563eb",
  publishing: "#9333ea",
  industrial: "#ea580c",
  specialty:  "#0891b2",
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function colorFromName(name: string) {
  const colors = [
    "linear-gradient(135deg,#4880FF,#2563eb)",
    "linear-gradient(135deg,#16a34a,#15803d)",
    "linear-gradient(135deg,#9333ea,#7c3aed)",
    "linear-gradient(135deg,#ea580c,#c2410c)",
    "linear-gradient(135deg,#0891b2,#0e7490)",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xfffffff;
  return colors[h % colors.length];
}

type Props = { locale: AdminLocale };

export function NotificationBell({ locale }: Props) {
  const isZh = locale === "zh";
  const [open, setOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/inquiries?status=NEW&limit=6", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setInquiries(json.inquiries ?? []);
      setNewCount(json.total ?? 0);
    } catch { /* silent */ }
  }, []);

  /* initial fetch + polling every 60s */
  useEffect(() => {
    fetchInquiries();
    const id = setInterval(fetchInquiries, 60_000);
    return () => clearInterval(id);
  }, [fetchInquiries]);

  /* re-fetch immediately when a status change is made anywhere in the panel */
  useEffect(() => {
    window.addEventListener("inquiry-status-changed", fetchInquiries);
    return () => window.removeEventListener("inquiry-status-changed", fetchInquiries);
  }, [fetchInquiries]);

  /* close on outside click */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  async function handleOpen() {
    setOpen((v) => !v);
    if (!open) {
      setLoading(true);
      await fetchInquiries();
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="relative flex items-center justify-center size-9 rounded-lg text-[#565E6C] hover:bg-[#F5F6FA] transition-colors"
        aria-label={isZh ? "通知" : "Notifications"}
      >
        <Bell className="size-[18px]" strokeWidth={1.8} />
        {newCount > 0 && (
          <span
            className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-[16px] rounded-full bg-[#EF3826] text-white text-[9px] font-bold px-[3px]"
            style={{ boxShadow: "0 0 0 2px white" }}
          >
            {newCount > 99 ? "99+" : newCount}
          </span>
        )}
        {newCount === 0 && (
          <span
            className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#EF3826] opacity-0"
            style={{ boxShadow: "0 0 0 2px white" }}
          />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[340px] rounded-2xl border border-[#EFEFEF] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          style={{ maxHeight: "480px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F1F3]">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#202224]">
                {isZh ? "新询盘通知" : "New Inquiries"}
              </span>
              {newCount > 0 && (
                <span className="inline-flex items-center justify-center h-[18px] min-w-[18px] rounded-full bg-[#EF3826] text-white text-[10px] font-bold px-1.5">
                  {newCount}
                </span>
              )}
            </div>
            <Link
              href="/admin/inquiries"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 text-[11px] font-medium text-[#4880FF] hover:underline"
            >
              {isZh ? "全部询盘" : "View all"}
              <ArrowRight className="size-3" strokeWidth={2} />
            </Link>
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: "380px" }}>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <svg className="h-5 w-5 animate-spin text-[#A0A5B1]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <Inbox className="size-8 text-[#D1D5DB]" strokeWidth={1.5} />
                <p className="text-[12px] text-[#9CA3AF]">
                  {isZh ? "暂无新询盘" : "No new inquiries"}
                </p>
              </div>
            ) : (
              <ul>
                {inquiries.map((inq, i) => (
                  <li key={inq.id}>
                    <Link
                      href="/admin/inquiries"
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors"
                    >
                      {/* Avatar */}
                      <div
                        className="flex items-center justify-center size-8 shrink-0 rounded-full text-white text-[11px] font-bold mt-0.5"
                        style={{ background: colorFromName(inq.name) }}
                      >
                        {initials(inq.name)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-[13px] font-semibold text-[#202224] truncate">
                            {inq.name}
                          </p>
                          <span className="text-[10px] font-mono text-[#9CA3AF] shrink-0">
                            {relativeTime(new Date(inq.createdAt), locale)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                          {inq.company}
                          {inq.market ? (
                            <span
                              className="ml-1.5 inline-flex items-center rounded px-1.5 py-0 text-[10px] font-mono font-medium text-white"
                              style={{
                                background: STATUS_COLORS[inq.market] ?? "#6B7280",
                              }}
                            >
                              {inq.market}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-[11px] text-[#9CA3AF] mt-1 line-clamp-1">
                          {inq.message}
                        </p>
                      </div>
                    </Link>
                    {i < inquiries.length - 1 && (
                      <div className="mx-4 h-px bg-[#F3F4F6]" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {inquiries.length > 0 && (
            <div className="border-t border-[#F0F1F3] px-4 py-2.5">
              <Link
                href="/admin/inquiries"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full rounded-lg py-2 text-[12px] font-medium text-[#4880FF] hover:bg-[#F5F6FA] transition-colors"
              >
                {isZh ? "前往询盘管理查看详情" : "Go to Inquiry Management"}
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

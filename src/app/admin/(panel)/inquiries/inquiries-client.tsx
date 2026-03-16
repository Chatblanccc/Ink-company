"use client";

import { useState, useMemo } from "react";
import {
  Mail, Phone, Building2, Globe, MessageSquare,
  Calendar, Tag, ChevronRight, ArrowLeft, Check,
} from "lucide-react";
import { relativeTime } from "@/lib/relative-time";

export type InquiryRow = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  market: string;
  message: string;
  language: string;
  source: string | null;
  status: string;
  createdAt: Date;
};

type Props = {
  initialInquiries: InquiryRow[];
  locale: "zh" | "en";
};

type Status = "ALL" | "NEW" | "QUALIFIED" | "FOLLOW_UP" | "CLOSED";

const STATUS_META: Record<string, { zh: string; en: string; dot: string; badge: string }> = {
  NEW:       { zh: "新询盘",  en: "New",        dot: "bg-sky-500",     badge: "bg-sky-50 text-sky-700 border-sky-200" },
  QUALIFIED: { zh: "已确认",  en: "Qualified",  dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  FOLLOW_UP: { zh: "跟进中",  en: "Follow-up",  dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-700 border-amber-200" },
  CLOSED:    { zh: "已关闭",  en: "Closed",     dot: "bg-slate-400",   badge: "bg-slate-100 text-slate-500 border-slate-200" },
};

const FILTER_TABS: { id: Status; zh: string; en: string }[] = [
  { id: "ALL",       zh: "全部",   en: "All" },
  { id: "NEW",       zh: "新询盘", en: "New" },
  { id: "QUALIFIED", zh: "已确认", en: "Qualified" },
  { id: "FOLLOW_UP", zh: "跟进中", en: "Follow-up" },
  { id: "CLOSED",    zh: "已关闭", en: "Closed" },
];

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

function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function InquiriesClient({ initialInquiries, locale }: Props) {
  const isZh = locale === "zh";
  const [inquiries, setInquiries] = useState<InquiryRow[]>(initialInquiries);
  const [filter, setFilter] = useState<Status>("ALL");
  const [selected, setSelected] = useState<string | null>(
    initialInquiries.length > 0 ? initialInquiries[0].id : null
  );
  const [showDetail, setShowDetail] = useState(false); // for mobile
  const [statusLoading, setStatusLoading] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: inquiries.length };
    for (const inq of inquiries) c[inq.status] = (c[inq.status] ?? 0) + 1;
    return c;
  }, [inquiries]);

  const filtered = useMemo(
    () => (filter === "ALL" ? inquiries : inquiries.filter((i) => i.status === filter)),
    [inquiries, filter]
  );

  const detail = inquiries.find((i) => i.id === selected) ?? null;

  async function changeStatus(id: string, status: string) {
    setStatusLoading(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
        // Notify the notification bell to refresh its count immediately
        window.dispatchEvent(new CustomEvent("inquiry-status-changed"));
      }
    } finally {
      setStatusLoading(false);
    }
  }

  function selectInquiry(id: string) {
    setSelected(id);
    setShowDetail(true);
  }

  return (
    <div className="flex h-full flex-col gap-4">

      {/* ── Filter tabs ──────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTER_TABS.map((tab) => {
          const count = counts[tab.id] ?? 0;
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-150",
                active
                  ? "bg-[#202224] text-white shadow-sm"
                  : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#9CA3AF] hover:text-[#374151]",
              ].join(" ")}
            >
              {isZh ? tab.zh : tab.en}
              {count > 0 && (
                <span className={[
                  "inline-flex items-center justify-center h-[16px] min-w-[16px] rounded-full text-[10px] font-bold px-1",
                  active ? "bg-white/20 text-white" : "bg-[#F3F4F6] text-[#6B7280]",
                ].join(" ")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
        <span className="ml-auto text-[12px] text-[#9CA3AF] font-mono">
          {isZh ? `共 ${filtered.length} 条` : `${filtered.length} records`}
        </span>
      </div>

      {/* ── Master / Detail ──────────────────────────────────────── */}
      <div className="flex flex-1 gap-4 min-h-0">

        {/* ── LEFT: inquiry list ─────────────────────────────────── */}
        <div className={[
          "flex flex-col gap-0 rounded-xl border border-[#EFEFEF] bg-white overflow-hidden",
          "w-full lg:w-[380px] lg:flex-none",
          showDetail ? "hidden lg:flex lg:flex-col" : "flex flex-col",
        ].join(" ")}>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <MessageSquare className="size-8 text-[#D1D5DB]" strokeWidth={1.5} />
              <p className="text-[13px] text-[#9CA3AF]">
                {isZh ? "暂无询盘" : "No inquiries"}
              </p>
            </div>
          ) : (
            <ul className="overflow-y-auto divide-y divide-[#F3F4F6]">
              {filtered.map((inq) => {
                const meta = STATUS_META[inq.status];
                const isActive = selected === inq.id;
                return (
                  <li key={inq.id}>
                    <button
                      onClick={() => selectInquiry(inq.id)}
                      className={[
                        "w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors",
                        isActive ? "bg-[#F5F7FF]" : "hover:bg-[#FAFAFA]",
                      ].join(" ")}
                    >
                      {/* Avatar */}
                      <div
                        className="flex items-center justify-center size-9 shrink-0 rounded-full text-white text-[11px] font-bold mt-0.5"
                        style={{ background: colorFromName(inq.name) }}
                      >
                        {initials(inq.name)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className={["text-[13px] font-semibold truncate", isActive ? "text-[#4880FF]" : "text-[#202224]"].join(" ")}>
                            {inq.name}
                          </p>
                          <span className="text-[10px] font-mono text-[#9CA3AF] shrink-0">
                            {relativeTime(inq.createdAt, locale)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280] truncate mt-0.5">{inq.company}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={["inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", meta?.badge ?? "bg-slate-100 text-slate-500 border-slate-200"].join(" ")}>
                            <span className={["size-1.5 rounded-full", meta?.dot ?? "bg-slate-400"].join(" ")} />
                            {isZh ? (meta?.zh ?? inq.status) : (meta?.en ?? inq.status)}
                          </span>
                          {inq.market && (
                            <span className="text-[10px] font-mono text-[#9CA3AF] truncate">{inq.market}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#9CA3AF] mt-1.5 line-clamp-1">{inq.message}</p>
                      </div>

                      <ChevronRight className={["size-4 shrink-0 mt-1 transition-colors", isActive ? "text-[#4880FF]" : "text-[#D1D5DB]"].join(" ")} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── RIGHT: detail panel ────────────────────────────────── */}
        <div className={[
          "flex-1 min-w-0 rounded-xl border border-[#EFEFEF] bg-white overflow-y-auto",
          showDetail ? "flex flex-col" : "hidden lg:flex lg:flex-col",
        ].join(" ")}>
          {!detail ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
              <MessageSquare className="size-10 text-[#E5E7EB]" strokeWidth={1.2} />
              <p className="text-[13px] text-[#9CA3AF]">
                {isZh ? "点击左侧询盘查看详情" : "Select an inquiry to view details"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full">

              {/* Detail header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F3F4F6] shrink-0">
                {/* Mobile back */}
                <button
                  onClick={() => setShowDetail(false)}
                  className="lg:hidden flex items-center justify-center size-8 rounded-lg text-[#6B7280] hover:bg-[#F5F6FA] transition-colors"
                >
                  <ArrowLeft className="size-4" />
                </button>

                <div
                  className="flex items-center justify-center size-10 shrink-0 rounded-full text-white text-[13px] font-bold"
                  style={{ background: colorFromName(detail.name) }}
                >
                  {initials(detail.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[#202224] truncate">{detail.name}</p>
                  <p className="text-[12px] text-[#6B7280] truncate">{detail.company}</p>
                </div>

                {/* Status change */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={detail.status}
                    disabled={statusLoading}
                    onChange={(e) => changeStatus(detail.id, e.target.value)}
                    className={[
                      "h-8 rounded-lg border px-2.5 text-[12px] font-medium transition-colors cursor-pointer",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                      STATUS_META[detail.status]?.badge ?? "bg-slate-100 text-slate-500 border-slate-200",
                    ].join(" ")}
                  >
                    <option value="NEW">{isZh ? "新询盘" : "New"}</option>
                    <option value="QUALIFIED">{isZh ? "已确认" : "Qualified"}</option>
                    <option value="FOLLOW_UP">{isZh ? "跟进中" : "Follow-up"}</option>
                    <option value="CLOSED">{isZh ? "已关闭" : "Closed"}</option>
                  </select>
                  {statusLoading && (
                    <svg className="h-4 w-4 animate-spin text-[#9CA3AF]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Detail body */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

                {/* Contact info */}
                <div className="rounded-xl border border-[#F3F4F6] bg-[#FAFAFA] divide-y divide-[#F3F4F6]">
                  <InfoRow icon={Mail} label={isZh ? "邮箱" : "Email"}>
                    <a href={`mailto:${detail.email}`} className="text-[#4880FF] hover:underline text-[13px]">
                      {detail.email}
                    </a>
                  </InfoRow>
                  {detail.phone && (
                    <InfoRow icon={Phone} label={isZh ? "电话" : "Phone"}>
                      <a href={`tel:${detail.phone}`} className="text-[13px] text-[#374151] hover:text-[#4880FF]">
                        {detail.phone}
                      </a>
                    </InfoRow>
                  )}
                  {detail.company && (
                    <InfoRow icon={Building2} label={isZh ? "公司" : "Company"}>
                      <span className="text-[13px] text-[#374151]">{detail.company}</span>
                    </InfoRow>
                  )}
                  {detail.market && (
                    <InfoRow icon={Tag} label={isZh ? "市场 / 产品类型" : "Market / Product"}>
                      <span className="text-[13px] font-mono text-[#374151]">{detail.market}</span>
                    </InfoRow>
                  )}
                  <InfoRow icon={Globe} label={isZh ? "语言" : "Language"}>
                    <span className="text-[13px] text-[#374151]">{detail.language === "zh" ? "中文" : "English"}</span>
                  </InfoRow>
                  <InfoRow icon={Calendar} label={isZh ? "接收时间" : "Received"}>
                    <span className="text-[13px] text-[#374151]">
                      {new Date(detail.createdAt).toLocaleString(
                        locale === "zh" ? "zh-CN" : "en-US",
                        { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </InfoRow>
                  {detail.source && (
                    <InfoRow icon={Globe} label={isZh ? "来源" : "Source"}>
                      <span className="text-[12px] font-mono text-[#9CA3AF]">{detail.source}</span>
                    </InfoRow>
                  )}
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="size-3.5 text-[#9CA3AF]" strokeWidth={2} />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                      {isZh ? "询盘内容" : "Message"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-[#F3F4F6] bg-white px-4 py-4">
                    <p className="text-[13px] leading-[1.75] text-[#374151] whitespace-pre-wrap">
                      {detail.message}
                    </p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2">
                  <a
                    href={`mailto:${detail.email}?subject=${encodeURIComponent(isZh ? "关于您的询盘" : "Re: Your Inquiry")}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#F5F6FA] transition-colors"
                  >
                    <Mail className="size-4" strokeWidth={1.8} />
                    {isZh ? "发送邮件" : "Send email"}
                  </a>
                  {["QUALIFIED", "FOLLOW_UP"].includes(detail.status) ? (
                    <button
                      onClick={() => changeStatus(detail.id, "CLOSED")}
                      disabled={statusLoading}
                      className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-[13px] font-medium text-[#6B7280] hover:bg-[#F5F6FA] transition-colors disabled:opacity-50"
                    >
                      <Check className="size-4" strokeWidth={2} />
                      {isZh ? "标记关闭" : "Close"}
                    </button>
                  ) : detail.status === "NEW" ? (
                    <button
                      onClick={() => changeStatus(detail.id, "QUALIFIED")}
                      disabled={statusLoading}
                      className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      <Check className="size-4" strokeWidth={2} />
                      {isZh ? "确认线索" : "Qualify"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Icon className="size-3.5 shrink-0 text-[#9CA3AF]" strokeWidth={1.8} />
      <span className="w-[90px] shrink-0 text-[11px] text-[#9CA3AF]">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

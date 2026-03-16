"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, PanelLeft, Search } from "lucide-react";

import { AdminSidebar } from "./admin-sidebar";
import { AdminLangToggle } from "./admin-lang-toggle";
import { NotificationBell } from "./notification-bell";
import { type AdminLocale } from "@/lib/admin-i18n";

type Props = {
  locale: AdminLocale;
  userName: string;
  userRole: string;
  initials: string;
  children: React.ReactNode;
};

export function AdminLayoutClient({ locale, userName, userRole, initials, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const isZh = locale === "zh";

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "#F5F6FA" }}>
      {/* Sidebar */}
      <AdminSidebar locale={locale} collapsed={collapsed} />

      {/* Main column — scrolls independently, sidebar stays fixed */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">

        {/* ── Topbar ─────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-20 flex items-center gap-3 bg-white px-5 py-3"
          style={{ boxShadow: "0 1px 0 #EFEFEF", minHeight: "60px" }}
        >
          {/* Sidebar toggle */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex items-center justify-center size-9 rounded-lg text-[#565E6C] hover:bg-[#F5F6FA] hover:text-[#4880FF] transition-colors"
            title={collapsed ? (isZh ? "展开侧边栏" : "Expand sidebar") : (isZh ? "收起侧边栏" : "Collapse sidebar")}
          >
            <PanelLeft
              className="size-[18px] transition-transform duration-300"
              style={{ transform: collapsed ? "scaleX(-1)" : "scaleX(1)" }}
              strokeWidth={1.8}
            />
          </button>

          {/* Search */}
          <div className="relative hidden sm:flex items-center flex-1 max-w-[320px]">
            <Search
              className="absolute left-3 size-4 text-[#A0A5B1] pointer-events-none"
              strokeWidth={1.8}
            />
            <input
              type="search"
              placeholder={isZh ? "搜索…" : "Search…"}
              className="w-full rounded-lg bg-[#F5F6FA] border-0 py-2 pl-9 pr-4 text-[13px] text-[#202224] placeholder:text-[#A0A5B1] focus:outline-none focus:ring-2 focus:ring-[#4880FF]/30"
            />
          </div>

          <div className="flex-1" />

          {/* Right group */}
          <div className="flex items-center gap-1.5">
            {/* View public site */}
            <Link
              href="/zh"
              className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium text-[#565E6C] hover:bg-[#F5F6FA] hover:text-[#4880FF] transition-colors"
            >
              <ExternalLink className="size-3.5" strokeWidth={1.8} />
              {isZh ? "前台" : "Site"}
            </Link>

            {/* Lang toggle */}
            <AdminLangToggle currentLang={locale} />

            {/* Bell — inquiry notifications */}
            <NotificationBell locale={locale} />

            {/* Divider */}
            <div className="w-px h-6 bg-[#F0F1F3] mx-1" />

            {/* Avatar + user info */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center size-9 rounded-full shrink-0 text-white text-[12px] font-bold"
                style={{ background: "linear-gradient(135deg,#4880FF,#9333ea)" }}
              >
                {initials}
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-[13px] font-semibold text-[#202224]">{userName}</span>
                <span className="text-[11px] text-[#A0A5B1] mt-0.5">{userRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────────── */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

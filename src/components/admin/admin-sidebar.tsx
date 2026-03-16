"use client";

import Link from "next/link";
import {
  BarChart3,
  Box,
  FileText,
  Home,
  Images,
  Info,
  LayoutTemplate,
  LogOut,
  Package2,
  ShieldCheck,
  Tag,
  Users2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { type AdminLocale, getAdminT } from "@/lib/admin-i18n";

type Props = { locale: AdminLocale; collapsed?: boolean };

export function AdminSidebar({ locale, collapsed = false }: Props) {
  const pathname = usePathname();
  const t = getAdminT(locale);
  const isZh = locale === "zh";

  const mainLinks = [
    { href: "/admin/dashboard",     label: t.navDashboard,                        icon: BarChart3 },
    { href: "/admin/products",      label: t.navProducts,                         icon: Package2 },
    { href: "/admin/categories",    label: isZh ? "分类与标签" : "Categories",     icon: Tag },
    { href: "/admin/inquiries",     label: t.navInquiries,                        icon: Users2 },
    { href: "/admin/users",         label: t.navUsers,                            icon: ShieldCheck },
  ];

  const pageLinks = [
    { href: "/admin/homepage",      label: t.navHomepage,     icon: Home },
    { href: "/admin/products-page", label: t.navProductsPage, icon: Images },
    { href: "/admin/about-page",    label: t.navAboutPage,    icon: Info },
    { href: "/admin/cms",           label: t.navCms,          icon: LayoutTemplate },
    { href: "/admin/articles",      label: t.navArticles,     icon: FileText },
  ];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      className="hidden xl:flex flex-col shrink-0 h-full bg-white transition-all duration-300 ease-in-out overflow-y-auto"
      style={{
        width: collapsed ? "68px" : "220px",
        boxShadow: "2px 0 12px rgba(2,46,86,0.06)",
      }}
    >
      {/* ── Brand ──────────────────────────────────────────────── */}
      <div
        className="flex items-center border-b border-[#F0F1F3] shrink-0 transition-all duration-300"
        style={{
          padding: collapsed ? "20px 14px" : "20px 20px",
          gap: collapsed ? 0 : "12px",
          minHeight: "64px",
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg,#4880FF 0%,#2563eb 100%)",
          }}
        >
          <Box className="size-5 text-white" strokeWidth={2} />
        </div>

        <div
          className="transition-all duration-200 overflow-hidden whitespace-nowrap"
          style={{
            width: collapsed ? "0px" : "140px",
            opacity: collapsed ? 0 : 1,
          }}
        >
          <p className="text-[15px] font-bold leading-none tracking-tight text-[#202224]">
            Ink Co.
          </p>
          <p className="text-[10px] text-[#A0A5B1] mt-0.5 tracking-wide">Admin Console</p>
        </div>
      </div>

      {/* ── Main nav ───────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-2 space-y-0.5"
        style={{ padding: collapsed ? "16px 10px 8px" : "16px 10px 8px" }}
      >
        {mainLinks.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={Icon}
              active={active}
              collapsed={collapsed}
            />
          );
        })}

        {/* PAGES section label */}
        <div
          className="overflow-hidden transition-all duration-200"
          style={{
            height: collapsed ? "24px" : "32px",
            paddingTop: "12px",
            paddingBottom: "4px",
            paddingLeft: collapsed ? "6px" : "10px",
          }}
        >
          {collapsed ? (
            <div className="w-5 h-px bg-[#E8EAED] mx-auto" />
          ) : (
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A0A5B1]">
              Pages
            </p>
          )}
        </div>

        {pageLinks.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={Icon}
              active={active}
              collapsed={collapsed}
            />
          );
        })}
      </nav>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div
        className="border-t border-[#F0F1F3] shrink-0"
        style={{ padding: collapsed ? "10px" : "10px" }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/admin/sign-in" })}
          title={isZh ? "退出登录" : "Sign out"}
          className={[
            "flex items-center rounded-lg w-full transition-colors text-[#565E6C] hover:bg-red-50 hover:text-red-500",
            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
          ].join(" ")}
        >
          <LogOut className="size-[17px] shrink-0" strokeWidth={1.8} />
          {!collapsed && (
            <span className="text-[13.5px] font-medium whitespace-nowrap">
              {isZh ? "退出登录" : "Sign out"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

/* ─── Nav item ────────────────────────────────────────────────────────── */

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={[
        "flex items-center rounded-lg transition-all duration-150",
        collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
        active
          ? "bg-[#4880FF] text-white shadow-sm"
          : "text-[#565E6C] hover:bg-[#F5F6FA] hover:text-[#202224]",
      ].join(" ")}
    >
      <Icon className="size-[17px] shrink-0" strokeWidth={active ? 2.2 : 1.8} />
      {!collapsed && (
        <span className="text-[13.5px] font-medium whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
    </Link>
  );
}

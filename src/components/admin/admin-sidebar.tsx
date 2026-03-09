"use client";

import Link from "next/link";
import { BarChart3, FileText, Home, Images, LayoutTemplate, Package2, ShieldCheck, Users2 } from "lucide-react";
import { usePathname } from "next/navigation";

import { type AdminLocale, getAdminT } from "@/lib/admin-i18n";

type Props = {
  locale: AdminLocale;
};

export function AdminSidebar({ locale }: Props) {
  const pathname = usePathname();
  const t = getAdminT(locale);

  const links = [
    { href: "/admin/dashboard",      label: t.navDashboard,     icon: BarChart3 },
    { href: "/admin/homepage",       label: t.navHomepage,      icon: Home },
    { href: "/admin/products-page",  label: t.navProductsPage,  icon: Images },
    { href: "/admin/cms",            label: t.navCms,           icon: LayoutTemplate },
    { href: "/admin/products",       label: t.navProducts,      icon: Package2 },
    { href: "/admin/articles",       label: t.navArticles,      icon: FileText },
    { href: "/admin/inquiries",      label: t.navInquiries,     icon: Users2 },
    { href: "/admin/users",          label: t.navUsers,         icon: ShieldCheck },
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-white xl:block">
      <div className="space-y-8 p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
            Ink Company
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.consoleName}
          </h1>
          <p className="text-sm text-slate-400">
            {t.consoleDesc}
          </p>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sky-500 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

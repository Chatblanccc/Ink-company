"use client";

import Link from "next/link";
import { BarChart3, FileText, LayoutTemplate, Package2, ShieldCheck, Users2 } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/cms", label: "CMS", icon: LayoutTemplate },
  { href: "/admin/products", label: "Products", icon: Package2 },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/inquiries", label: "Inquiries", icon: Users2 },
  { href: "/admin/users", label: "Users & roles", icon: ShieldCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-white xl:block">
      <div className="space-y-8 p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
            Ink Company
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Console
          </h1>
          <p className="text-sm text-slate-400">
            SEO-aware content ops for the corporate website.
          </p>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

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

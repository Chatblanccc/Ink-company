import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AdminLangToggle } from "@/components/admin/admin-lang-toggle";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { authOptions } from "@/lib/auth";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";

export default async function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [session, locale] = await Promise.all([
    getServerSession(authOptions),
    getAdminLocale(),
  ]);

  // Server-side guard — belt-and-suspenders on top of middleware
  if (!session?.user) {
    redirect("/admin/sign-in");
  }

  const t = getAdminT(locale);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <AdminSidebar locale={locale} />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-10">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">
                  {t.adminLabel}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {t.websiteOps}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/zh"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-sky-700"
                >
                  {t.viewPublicSite}
                </Link>
                <AdminLangToggle currentLang={locale} />
                <div className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">
                  {session.user.email ?? "admin@ink-company.com"} &middot;{" "}
                  {session.user.role ?? "SUPER_ADMIN"}
                </div>
                <SignOutButton label={locale === "zh" ? "退出登录" : "Sign out"} />
              </div>
            </div>
          </header>
          <div className="flex-1 p-6 lg:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

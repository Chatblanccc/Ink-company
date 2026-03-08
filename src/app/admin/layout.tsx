import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-10">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">
                  Admin
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Website operations
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/zh"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-sky-700"
                >
                  View public site
                </Link>
                <div className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">
                  {session?.user?.email ?? "admin@ink-company.com"} ·{" "}
                  {session?.user?.role ?? "SUPER_ADMIN"}
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6 lg:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

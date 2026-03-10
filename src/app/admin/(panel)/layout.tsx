import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AdminLayoutClient } from "@/components/admin/admin-layout-client";
import { authOptions } from "@/lib/auth";
import { getAdminLocale } from "@/lib/admin-lang";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const [session, locale] = await Promise.all([
    getServerSession(authOptions),
    getAdminLocale(),
  ]);

  if (!session?.user) redirect("/admin/sign-in");

  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Admin";
  const userRole = (session.user as { role?: string }).role ?? "SUPER_ADMIN";
  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <AdminLayoutClient
      locale={locale}
      userName={userName}
      userRole={userRole}
      initials={initials}
    >
      {children}
    </AdminLayoutClient>
  );
}

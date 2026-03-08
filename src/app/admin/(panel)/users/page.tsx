import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authOptions } from "@/lib/auth";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const [session, locale] = await Promise.all([
    getServerSession(authOptions),
    getAdminLocale(),
  ]);

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const t = getAdminT(locale);
  const prisma = getPrismaClient();

  type Row = { id: string; name: string; email: string; role: string };
  let users: Row[] = [];

  if (prisma) {
    try {
      const rows = await prisma.user.findMany({
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, email: true, role: true },
      });
      users = rows.map((u) => ({
        id: u.id,
        name: u.name ?? u.email,
        email: u.email,
        role: u.role,
      }));
    } catch {
      // DB unavailable
    }
  }

  const ROLE_COLORS: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    EDITOR: "bg-sky-100 text-sky-700 hover:bg-sky-100",
    SALES: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    ANALYST: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          {t.usersTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            {locale === "zh" ? "暂无用户数据" : "No users found"}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.colName}</TableHead>
                <TableHead>{t.colEmail}</TableHead>
                <TableHead>{t.colRole}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-slate-950">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={ROLE_COLORS[user.role] ?? "bg-slate-100 text-slate-600"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

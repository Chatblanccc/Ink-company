import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-sky-100 text-sky-700 hover:bg-sky-100",
  QUALIFIED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  FOLLOW_UP: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  CLOSED: "bg-slate-100 text-slate-600 hover:bg-slate-100",
};

export default async function AdminInquiriesPage() {
  const [locale, prisma] = [await getAdminLocale(), getPrismaClient()];
  const t = getAdminT(locale);

  type Row = { id: string; name: string; company: string; email: string; market: string; status: string; createdAt: string };
  let inquiries: Row[] = [];

  if (prisma) {
    try {
      const rows = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
      });
      inquiries = rows.map((i) => ({
        id: i.id,
        name: i.name,
        company: i.company,
        email: i.email,
        market: i.market,
        status: i.status,
        createdAt: i.createdAt.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
    } catch {
      // DB unavailable
    }
  }

  const statusLabel: Record<string, string> = {
    NEW: t.statusNew,
    QUALIFIED: t.statusQualified,
    FOLLOW_UP: t.statusFollowUp,
    CLOSED: t.statusClosed,
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          {t.inquiriesTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {inquiries.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            {locale === "zh" ? "暂无询盘记录" : "No inquiries yet"}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.colContact}</TableHead>
                <TableHead>{t.colMarket}</TableHead>
                <TableHead>{t.colStatus}</TableHead>
                <TableHead>{t.colReceived}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-950">{inquiry.name}</p>
                      <p className="text-sm text-slate-500">{inquiry.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{inquiry.market}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[inquiry.status] ?? "bg-slate-100 text-slate-600"}>
                      {statusLabel[inquiry.status] ?? inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">{inquiry.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

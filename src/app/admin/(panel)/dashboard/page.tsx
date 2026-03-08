import { KpiCard } from "@/components/admin/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPrismaClient } from "@/lib/prisma";
import { getAdminT } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-lang";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-sky-100 text-sky-700",
  QUALIFIED: "bg-emerald-100 text-emerald-700",
  FOLLOW_UP: "bg-amber-100 text-amber-700",
  CLOSED: "bg-slate-100 text-slate-600",
};

export default async function AdminDashboardPage() {
  const [locale, prisma] = [await getAdminLocale(), getPrismaClient()];
  const t = getAdminT(locale);

  type InquiryRow = { id: string; name: string; company: string; email: string; market: string; status: string; createdAt: string };
  type MetricRow = { label: string; value: string; delta: string };

  let recentInquiries: InquiryRow[] = [];
  let metrics: MetricRow[] = [
    { label: t.metricTotal, value: "0", delta: `0 ${locale === "zh" ? "新" : "new"}` },
    { label: t.metricQualified, value: "0", delta: "" },
    { label: t.metricProducts, value: "0", delta: "" },
    { label: t.metricArticles, value: "0", delta: "" },
  ];

  if (prisma) {
    try {
      const [totalInquiries, newInquiries, qualifiedInquiries, totalProducts, totalArticles, rows] =
        await Promise.all([
          prisma.inquiry.count(),
          prisma.inquiry.count({ where: { status: "NEW" } }),
          prisma.inquiry.count({ where: { status: "QUALIFIED" } }),
          prisma.product.count(),
          prisma.article.count(),
          prisma.inquiry.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
          }),
        ]);

      metrics = [
        { label: t.metricTotal, value: String(totalInquiries), delta: `${newInquiries} ${locale === "zh" ? "新" : "new"}` },
        { label: t.metricQualified, value: String(qualifiedInquiries), delta: "" },
        { label: t.metricProducts, value: String(totalProducts), delta: "" },
        { label: t.metricArticles, value: String(totalArticles), delta: "" },
      ];

      recentInquiries = rows.map((i) => ({
        id: i.id,
        name: i.name,
        company: i.company,
        email: i.email,
        market: i.market,
        status: i.status,
        createdAt: i.createdAt.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
    } catch {
      // DB unavailable — metrics stay at 0
    }
  }

  const statusLabel: Record<string, string> = {
    NEW: t.statusNew,
    QUALIFIED: t.statusQualified,
    FOLLOW_UP: t.statusFollowUp,
    CLOSED: t.statusClosed,
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} />
        ))}
      </section>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-950">
            {t.latestInquiries}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentInquiries.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              {locale === "zh" ? "暂无询盘记录" : "No inquiries yet"}
            </p>
          ) : (
            recentInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="rounded-[1.5rem] border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{inquiry.name}</p>
                    <p className="text-sm text-slate-500">{inquiry.company || inquiry.email}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`rounded-full ${STATUS_COLORS[inquiry.status] ?? ""}`}
                  >
                    {statusLabel[inquiry.status] ?? inquiry.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{inquiry.email}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                  {inquiry.market} · {inquiry.createdAt}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

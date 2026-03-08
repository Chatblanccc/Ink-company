import { KpiCard } from "@/components/admin/kpi-card";
import { TrafficChart } from "@/components/admin/traffic-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  adminMetrics,
  inquiries,
  trafficSeries,
} from "@/lib/demo-data";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-950">
              Traffic and inquiries trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrafficChart data={trafficSeries} />
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-950">
              Latest inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="rounded-[1.5rem] border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{inquiry.name}</p>
                    <p className="text-sm text-slate-500">{inquiry.company}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {inquiry.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{inquiry.email}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                  {inquiry.market} · {inquiry.createdAt}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

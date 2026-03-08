import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KpiCardProps = {
  label: string;
  value: string;
  delta: string;
};

export function KpiCard({ label, value, delta }: KpiCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium text-slate-500">
          {label}
        </CardTitle>
        <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
          <ArrowUpRight className="size-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-semibold tracking-tight text-slate-950">
          {value}
        </div>
        <p className="text-sm text-emerald-600">{delta} vs last month</p>
      </CardContent>
    </Card>
  );
}

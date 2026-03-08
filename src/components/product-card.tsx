import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Product, t } from "@/lib/demo-data";
import { type Locale } from "@/lib/i18n";

type ProductCardProps = {
  locale: Locale;
  product: Product;
};

export function ProductCard({ locale, product }: ProductCardProps) {
  return (
    <Card className="group h-full border-slate-200 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="space-y-4">
        <Badge className="w-fit rounded-full bg-sky-100 px-3 py-1 text-sky-700 hover:bg-sky-100">
          {t(product.category, locale)}
        </Badge>
        <div className="space-y-3">
          <CardTitle className="text-2xl leading-tight text-slate-950">
            {t(product.title, locale)}
          </CardTitle>
          <p className="text-sm leading-7 text-slate-600">
            {t(product.summary, locale)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-between gap-6">
        <ul className="space-y-3 text-sm leading-6 text-slate-600">
          {product.features.slice(0, 3).map((feature) => (
            <li key={feature.en} className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
              <span>{t(feature, locale)}</span>
            </li>
          ))}
        </ul>
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition-colors hover:text-sky-700"
        >
          {locale === "zh" ? "查看详情" : "View details"}
          <ArrowUpRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

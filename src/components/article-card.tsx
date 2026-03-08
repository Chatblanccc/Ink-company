import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Article, t } from "@/lib/demo-data";
import { type Locale } from "@/lib/i18n";

type ArticleCardProps = {
  locale: Locale;
  article: Article;
};

export function ArticleCard({ locale, article }: ArticleCardProps) {
  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <Badge variant="outline" className="rounded-full border-slate-200">
            {t(article.category, locale)}
          </Badge>
          <span>{article.publishedAt}</span>
        </div>
        <CardTitle className="text-2xl leading-tight text-slate-950">
          {t(article.title, locale)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-7 text-slate-600">
          {t(article.excerpt, locale)}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {article.readTime} min read
          </span>
          <Link
            href={`/${locale}/news/${article.slug}`}
            className="inline-flex items-center gap-2 font-semibold text-slate-950 transition-colors hover:text-sky-700"
          >
            {locale === "zh" ? "阅读内容" : "Read story"}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

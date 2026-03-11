import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import Link from "next/link";

import { getAdminLocale } from "@/lib/admin-lang";
import { getPrismaClient } from "@/lib/prisma";
import { ArticleForm, type ArticleFormData } from "../../article-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const locale = await getAdminLocale();
  const isZh = locale === "zh";

  const prisma = getPrismaClient();
  if (!prisma) notFound();

  let article;
  try {
    article = await prisma.article.findUnique({ where: { id } });
  } catch {
    notFound();
  }
  if (!article) notFound();

  const initial: ArticleFormData = {
    id: article.id,
    slug: article.slug,
    type: article.type as ArticleFormData["type"],
    category: article.category as ArticleFormData["category"],
    title: article.title as ArticleFormData["title"],
    excerpt: article.excerpt as ArticleFormData["excerpt"],
    content: article.content as ArticleFormData["content"],
    seoTitle: article.seoTitle as ArticleFormData["seoTitle"],
    seoDescription: article.seoDescription as ArticleFormData["seoDescription"],
    publishedAt: article.publishedAt.toISOString(),
    featured: article.featured,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="size-6 text-slate-500" />
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            {isZh ? "编辑文章" : "Edit article"}
          </h2>
          <p className="text-sm text-slate-500">
            {isZh ? (
              <>
                <Link href="/admin/articles" className="text-sky-600 hover:underline">
                  文章管理
                </Link>
                {` / ${article.slug}`}
              </>
            ) : (
              <>
                <Link href="/admin/articles" className="text-sky-600 hover:underline">
                  Articles
                </Link>
                {` / ${article.slug}`}
              </>
            )}
          </p>
        </div>
      </div>

      <ArticleForm initial={initial} locale={locale} />
    </div>
  );
}

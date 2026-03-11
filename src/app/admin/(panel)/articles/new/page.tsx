import { FileText } from "lucide-react";
import Link from "next/link";

import { getAdminLocale } from "@/lib/admin-lang";
import { ArticleForm } from "../article-form";

export default async function NewArticlePage() {
  const locale = await getAdminLocale();
  const isZh = locale === "zh";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="size-6 text-slate-500" />
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            {isZh ? "新建文章" : "New article"}
          </h2>
          <p className="text-sm text-slate-500">
            {isZh ? (
              <>
                <Link href="/admin/articles" className="text-sky-600 hover:underline">
                  文章管理
                </Link>
                {" / 新建"}
              </>
            ) : (
              <>
                <Link href="/admin/articles" className="text-sky-600 hover:underline">
                  Articles
                </Link>
                {" / New"}
              </>
            )}
          </p>
        </div>
      </div>

      <ArticleForm locale={locale} />
    </div>
  );
}

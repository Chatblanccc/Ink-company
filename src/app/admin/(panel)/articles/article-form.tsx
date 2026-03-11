"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* ─── Types ─────────────────────────────────────────────────────────── */

type BiLang = { zh: string; en: string };

export type ArticleFormData = {
  id?: string;
  slug: string;
  type: "NEWS" | "CASE_STUDY" | "INSIGHT";
  category: BiLang;
  title: BiLang;
  excerpt: BiLang;
  content: BiLang;
  seoTitle: BiLang;
  seoDescription: BiLang;
  publishedAt: string;
  featured: boolean;
};

type Props = {
  initial?: ArticleFormData;
  locale: "zh" | "en";
};

/* ─── Helpers ────────────────────────────────────────────────────────── */

const emptyBi = (): BiLang => ({ zh: "", en: "" });

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-2 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </h3>
  );
}

function BiField({
  label,
  valueZh,
  valueEn,
  onChangeZh,
  onChangeEn,
  multiline = false,
  rows = 3,
  hint,
}: {
  label: string;
  valueZh: string;
  valueEn: string;
  onChangeZh: (v: string) => void;
  onChangeEn: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  const Tag = multiline ? Textarea : Input;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-slate-700">{label}</Label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-xs font-mono text-slate-400">ZH</span>
          <Tag
            value={valueZh}
            onChange={(e) => onChangeZh(e.target.value)}
            className="border-slate-200 bg-white text-sm"
            rows={multiline ? rows : undefined}
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono text-slate-400">EN</span>
          <Tag
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            className="border-slate-200 bg-white text-sm"
            rows={multiline ? rows : undefined}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Datetime helpers ───────────────────────────────────────────────── */

// Converts a Date or ISO string to the "YYYY-MM-DDTHH:mm" format that
// datetime-local inputs expect — using the browser's LOCAL timezone, not UTC.
function toLocalDatetimeInput(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

/* ─── Main Form ──────────────────────────────────────────────────────── */

export function ArticleForm({ initial, locale }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const isZh = locale === "zh";

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [type, setType] = useState<ArticleFormData["type"]>(initial?.type ?? "INSIGHT");
  const [category, setCategory] = useState<BiLang>(initial?.category ?? emptyBi());
  const [title, setTitle] = useState<BiLang>(initial?.title ?? emptyBi());
  const [excerpt, setExcerpt] = useState<BiLang>(initial?.excerpt ?? emptyBi());
  const [content, setContent] = useState<BiLang>(initial?.content ?? emptyBi());
  const [seoTitle, setSeoTitle] = useState<BiLang>(initial?.seoTitle ?? emptyBi());
  const [seoDescription, setSeoDescription] = useState<BiLang>(
    initial?.seoDescription ?? emptyBi(),
  );
  const [publishedAt, setPublishedAt] = useState(
    toLocalDatetimeInput(initial?.publishedAt ? new Date(initial.publishedAt) : new Date()),
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Submit ──────────────────────────────────────────────────────── */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      slug,
      type,
      category,
      title,
      excerpt,
      content,
      seoTitle,
      seoDescription,
      publishedAt: new Date(publishedAt).toISOString(),
      featured,
    };

    try {
      const url = isEdit
        ? `/api/admin/articles/${initial!.id}`
        : "/api/admin/articles";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data.error ?? "Unknown error"));
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  const typeOptions: { value: ArticleFormData["type"]; labelZh: string; labelEn: string }[] = [
    { value: "NEWS", labelZh: "行业资讯", labelEn: "News" },
    { value: "CASE_STUDY", labelZh: "案例研究", labelEn: "Case Study" },
    { value: "INSIGHT", labelZh: "深度洞察", labelEn: "Insight" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Basic ───────────────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "基本信息" : "Basic info"}</SectionTitle>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Slug
              <span className="ml-1 text-xs font-normal text-slate-400">
                {isZh ? "（URL 路径，仅小写字母和连字符）" : "(URL path, lowercase + hyphens)"}
              </span>
            </Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isEdit}
              placeholder="ink-industry-trends-2025"
              className="border-slate-200 bg-white font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              {isZh ? "文章类型" : "Article type"}
            </Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ArticleFormData["type"])}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {isZh ? opt.labelZh : opt.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              {isZh ? "发布日期" : "Published at"}
            </Label>
            <Input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="border-slate-200 bg-white text-sm"
              required
            />
          </div>

          <div className="flex items-end pb-0.5">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="size-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">
                {isZh ? "推荐文章（首页展示）" : "Featured article (shown on homepage)"}
              </span>
            </label>
          </div>
        </div>

        <BiField
          label={isZh ? "分类标签" : "Category"}
          valueZh={category.zh}
          valueEn={category.en}
          onChangeZh={(v) => setCategory((p) => ({ ...p, zh: v }))}
          onChangeEn={(v) => setCategory((p) => ({ ...p, en: v }))}
          hint={isZh ? "（如：行业资讯、水性油墨）" : "(e.g. Industry News, Water-Based Inks)"}
        />
      </section>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "文章内容" : "Article content"}</SectionTitle>

        <BiField
          label={isZh ? "标题" : "Title"}
          valueZh={title.zh}
          valueEn={title.en}
          onChangeZh={(v) => setTitle((p) => ({ ...p, zh: v }))}
          onChangeEn={(v) => setTitle((p) => ({ ...p, en: v }))}
        />

        <BiField
          label={isZh ? "摘要" : "Excerpt"}
          valueZh={excerpt.zh}
          valueEn={excerpt.en}
          onChangeZh={(v) => setExcerpt((p) => ({ ...p, zh: v }))}
          onChangeEn={(v) => setExcerpt((p) => ({ ...p, en: v }))}
          multiline
          rows={3}
          hint={isZh ? "（列表页展示的简短描述）" : "(short description shown in article listings)"}
        />

        <BiField
          label={isZh ? "正文内容" : "Body content"}
          valueZh={content.zh}
          valueEn={content.en}
          onChangeZh={(v) => setContent((p) => ({ ...p, zh: v }))}
          onChangeEn={(v) => setContent((p) => ({ ...p, en: v }))}
          multiline
          rows={16}
          hint={isZh ? "（支持段落换行）" : "(paragraphs separated by blank lines)"}
        />
      </section>

      {/* ── SEO ─────────────────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>SEO</SectionTitle>

        <BiField
          label={isZh ? "SEO 标题" : "SEO title"}
          valueZh={seoTitle.zh}
          valueEn={seoTitle.en}
          onChangeZh={(v) => setSeoTitle((p) => ({ ...p, zh: v }))}
          onChangeEn={(v) => setSeoTitle((p) => ({ ...p, en: v }))}
        />

        <BiField
          label={isZh ? "SEO 描述" : "SEO description"}
          valueZh={seoDescription.zh}
          valueEn={seoDescription.en}
          onChangeZh={(v) => setSeoDescription((p) => ({ ...p, zh: v }))}
          onChangeEn={(v) => setSeoDescription((p) => ({ ...p, en: v }))}
          multiline
          rows={3}
        />
      </section>

      {/* ── Submit ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/articles")}
          className="text-slate-600"
        >
          {isZh ? "取消" : "Cancel"}
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="min-w-[120px] bg-sky-600 text-white hover:bg-sky-700"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              {isZh ? "保存中…" : "Saving…"}
            </span>
          ) : isEdit ? (
            isZh ? "保存更改" : "Save changes"
          ) : (
            isZh ? "发布文章" : "Publish article"
          )}
        </Button>
      </div>
    </form>
  );
}

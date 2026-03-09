"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { ProductsPageData } from "@/lib/products-page-defaults";

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-2 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </h3>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-slate-700">{label}</Label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function BiRow({
  label,
  zh,
  en,
  onZh,
  onEn,
  multiline = false,
  hint,
}: {
  label: string;
  zh: string;
  en: string;
  onZh: (v: string) => void;
  onEn: (v: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  const Tag = multiline ? Textarea : Input;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-slate-700">{label}</Label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-xs font-mono text-slate-400">ZH</span>
          <Tag value={zh} onChange={(e) => onZh(e.target.value)} className="border-slate-200 bg-white text-sm" rows={multiline ? 3 : undefined} />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono text-slate-400">EN</span>
          <Tag value={en} onChange={(e) => onEn(e.target.value)} className="border-slate-200 bg-white text-sm" rows={multiline ? 3 : undefined} />
        </div>
      </div>
    </div>
  );
}

type Props = {
  initial: ProductsPageData;
  locale: "zh" | "en";
};

export function ProductsPageForm({ initial, locale }: Props) {
  const isZh = locale === "zh";

  // ── hero
  const [hero, setHero] = useState(initial.hero);
  // ── categories
  const [categories, setCategories] = useState(initial.categories);
  // ── productLines
  const [productLines, setProductLines] = useState(initial.productLines);
  // ── banner
  const [banner, setBanner] = useState(initial.banner);
  // ── testimonial
  const [testimonial, setTestimonial] = useState(initial.testimonial);
  // ── editorialPanels
  const [editorialPanels, setEditorialPanels] = useState(initial.editorialPanels);
  // ── promises
  const [promises, setPromises] = useState(initial.promises);

  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    startTransition(async () => {
      setSaved(false);
      setError(null);
      try {
        const res = await fetch("/api/admin/products-page", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero, categories, productLines, banner, testimonial, editorialPanels, promises }),
        });
        if (!res.ok) throw new Error("Save failed");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Sticky save bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 shadow-sm backdrop-blur">
        <p className="text-sm font-medium text-slate-700">
          {isZh ? "产品页内容管理" : "Products page content"}
        </p>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
            saved
              ? "bg-emerald-500 hover:bg-emerald-500 text-white"
              : "bg-slate-950 hover:bg-slate-800 text-white"
          }`}
        >
          {isPending ? (
            <><Loader2 className="mr-2 size-4 animate-spin" />{isZh ? "保存中…" : "Saving…"}</>
          ) : saved ? (
            <><CheckCircle2 className="mr-2 size-4" />{isZh ? "已保存 ✓" : "Saved ✓"}</>
          ) : (
            <><Save className="mr-2 size-4" />{isZh ? "保存更改" : "Save changes"}</>
          )}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "顶部 Hero 区域" : "Hero section"}</SectionTitle>
        <BiRow label={isZh ? "大标题" : "Headline"} zh={hero.titleZh} en={hero.titleEn}
          onZh={(v) => setHero((p) => ({ ...p, titleZh: v }))}
          onEn={(v) => setHero((p) => ({ ...p, titleEn: v }))} />
        <BiRow label={isZh ? "副标题" : "Subtitle"} zh={hero.subtitleZh} en={hero.subtitleEn}
          onZh={(v) => setHero((p) => ({ ...p, subtitleZh: v }))}
          onEn={(v) => setHero((p) => ({ ...p, subtitleEn: v }))} multiline />
        <BiRow label={isZh ? "按钮文字" : "CTA text"} zh={hero.ctaZh} en={hero.ctaEn}
          onZh={(v) => setHero((p) => ({ ...p, ctaZh: v }))}
          onEn={(v) => setHero((p) => ({ ...p, ctaEn: v }))} />
        <FieldRow label={isZh ? "背景图 URL" : "Background image URL"}>
          <Input value={hero.bgImage} onChange={(e) => setHero((p) => ({ ...p, bgImage: e.target.value }))}
            className="border-slate-200 bg-white font-mono text-sm" />
        </FieldRow>
      </section>

      {/* ── Categories ─────────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "应用场景分类卡片（5 个）" : "Category cards (5)"}</SectionTitle>
        {categories.map((cat, idx) => (
          <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-3">
            <Badge className="bg-slate-200 text-slate-600 hover:bg-slate-200">{isZh ? `分类 ${idx + 1}` : `Category ${idx + 1}`}</Badge>
            <BiRow label={isZh ? "标签" : "Label"} zh={cat.labelZh} en={cat.labelEn}
              onZh={(v) => setCategories((p) => p.map((c, i) => i === idx ? { ...c, labelZh: v } : c))}
              onEn={(v) => setCategories((p) => p.map((c, i) => i === idx ? { ...c, labelEn: v } : c))} />
            <FieldRow label={isZh ? "图片 URL" : "Image URL"}>
              <Input value={cat.img} onChange={(e) => setCategories((p) => p.map((c, i) => i === idx ? { ...c, img: e.target.value } : c))}
                className="border-slate-200 bg-white font-mono text-sm" />
            </FieldRow>
          </div>
        ))}
      </section>

      {/* ── Product Lines ───────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "三栏产品线编辑面板" : "Three product-line editorial columns"}</SectionTitle>
        {productLines.map((line, idx) => (
          <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-3">
            <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">{isZh ? `栏 ${idx + 1}` : `Column ${idx + 1}`}</Badge>
            <BiRow label={isZh ? "标题" : "Title"} zh={line.titleZh} en={line.titleEn}
              onZh={(v) => setProductLines((p) => p.map((l, i) => i === idx ? { ...l, titleZh: v } : l))}
              onEn={(v) => setProductLines((p) => p.map((l, i) => i === idx ? { ...l, titleEn: v } : l))} />
            <BiRow label={isZh ? "副标题" : "Sub-title"} zh={line.subZh} en={line.subEn}
              onZh={(v) => setProductLines((p) => p.map((l, i) => i === idx ? { ...l, subZh: v } : l))}
              onEn={(v) => setProductLines((p) => p.map((l, i) => i === idx ? { ...l, subEn: v } : l))} />
            <BiRow label={isZh ? "按钮文字" : "CTA"} zh={line.ctaZh} en={line.ctaEn}
              onZh={(v) => setProductLines((p) => p.map((l, i) => i === idx ? { ...l, ctaZh: v } : l))}
              onEn={(v) => setProductLines((p) => p.map((l, i) => i === idx ? { ...l, ctaEn: v } : l))} />
            <FieldRow label={isZh ? "图片 URL" : "Image URL"}>
              <Input value={line.img} onChange={(e) => setProductLines((p) => p.map((l, i) => i === idx ? { ...l, img: e.target.value } : l))}
                className="border-slate-200 bg-white font-mono text-sm" />
            </FieldRow>
            <FieldRow label={isZh ? "跳转产品 Slug" : "Target product slug"} hint={isZh ? "（如：water-based-flexo-ink）" : "(e.g. water-based-flexo-ink)"}>
              <Input value={line.slug} onChange={(e) => setProductLines((p) => p.map((l, i) => i === idx ? { ...l, slug: e.target.value } : l))}
                className="border-slate-200 bg-white font-mono text-sm" />
            </FieldRow>
          </div>
        ))}
      </section>

      {/* ── Banner ──────────────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "全宽 Banner 板块" : "Full-width banner"}</SectionTitle>
        <BiRow label={isZh ? "眉标" : "Eyebrow"} zh={banner.eyebrowZh} en={banner.eyebrowEn}
          onZh={(v) => setBanner((p) => ({ ...p, eyebrowZh: v }))}
          onEn={(v) => setBanner((p) => ({ ...p, eyebrowEn: v }))} />
        <BiRow label={isZh ? "标题" : "Headline"} zh={banner.headlineZh} en={banner.headlineEn}
          onZh={(v) => setBanner((p) => ({ ...p, headlineZh: v }))}
          onEn={(v) => setBanner((p) => ({ ...p, headlineEn: v }))} />
        <BiRow label={isZh ? "按钮文字" : "CTA text"} zh={banner.ctaZh} en={banner.ctaEn}
          onZh={(v) => setBanner((p) => ({ ...p, ctaZh: v }))}
          onEn={(v) => setBanner((p) => ({ ...p, ctaEn: v }))} />
        <FieldRow label={isZh ? "背景图 URL" : "Background image URL"}>
          <Input value={banner.bgImage} onChange={(e) => setBanner((p) => ({ ...p, bgImage: e.target.value }))}
            className="border-slate-200 bg-white font-mono text-sm" />
        </FieldRow>
      </section>

      {/* ── Testimonial ──────────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "客户评价引用" : "Customer testimonial"}</SectionTitle>
        <BiRow label={isZh ? "引言" : "Quote"} zh={testimonial.quoteZh} en={testimonial.quoteEn}
          onZh={(v) => setTestimonial((p) => ({ ...p, quoteZh: v }))}
          onEn={(v) => setTestimonial((p) => ({ ...p, quoteEn: v }))} multiline />
        <BiRow label={isZh ? "姓名" : "Author"} zh={testimonial.authorZh} en={testimonial.authorEn}
          onZh={(v) => setTestimonial((p) => ({ ...p, authorZh: v }))}
          onEn={(v) => setTestimonial((p) => ({ ...p, authorEn: v }))} />
        <BiRow label={isZh ? "职位" : "Role"} zh={testimonial.roleZh} en={testimonial.roleEn}
          onZh={(v) => setTestimonial((p) => ({ ...p, roleZh: v }))}
          onEn={(v) => setTestimonial((p) => ({ ...p, roleEn: v }))} />
        <FieldRow label={isZh ? "图片 URL" : "Photo URL"}>
          <Input value={testimonial.img} onChange={(e) => setTestimonial((p) => ({ ...p, img: e.target.value }))}
            className="border-slate-200 bg-white font-mono text-sm" />
        </FieldRow>
      </section>

      {/* ── Editorial Panels ─────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "双栏编辑面板" : "Two editorial panels"}</SectionTitle>
        {editorialPanels.map((panel, idx) => (
          <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-3">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{isZh ? `面板 ${idx + 1}` : `Panel ${idx + 1}`}</Badge>
            <BiRow label={isZh ? "标题" : "Label"} zh={panel.labelZh} en={panel.labelEn}
              onZh={(v) => setEditorialPanels((p) => p.map((ep, i) => i === idx ? { ...ep, labelZh: v } : ep))}
              onEn={(v) => setEditorialPanels((p) => p.map((ep, i) => i === idx ? { ...ep, labelEn: v } : ep))} />
            <BiRow label={isZh ? "按钮文字" : "CTA"} zh={panel.ctaZh} en={panel.ctaEn}
              onZh={(v) => setEditorialPanels((p) => p.map((ep, i) => i === idx ? { ...ep, ctaZh: v } : ep))}
              onEn={(v) => setEditorialPanels((p) => p.map((ep, i) => i === idx ? { ...ep, ctaEn: v } : ep))} />
            <FieldRow label={isZh ? "跳转链接" : "Link href"}>
              <Input value={panel.href} onChange={(e) => setEditorialPanels((p) => p.map((ep, i) => i === idx ? { ...ep, href: e.target.value } : ep))}
                className="border-slate-200 bg-white font-mono text-sm" />
            </FieldRow>
            <FieldRow label={isZh ? "图片 URL" : "Image URL"}>
              <Input value={panel.img} onChange={(e) => setEditorialPanels((p) => p.map((ep, i) => i === idx ? { ...ep, img: e.target.value } : ep))}
                className="border-slate-200 bg-white font-mono text-sm" />
            </FieldRow>
          </div>
        ))}
      </section>

      {/* ── Promises ─────────────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "服务承诺（底部 4 格）" : "Service promises (bottom 4-grid)"}</SectionTitle>
        {promises.map((p, idx) => (
          <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-3">
            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
              {isZh ? `承诺 ${idx + 1}` : `Promise ${idx + 1}`}
            </Badge>
            <BiRow label={isZh ? "标题" : "Title"} zh={p.titleZh} en={p.titleEn}
              onZh={(v) => setPromises((prev) => prev.map((x, i) => i === idx ? { ...x, titleZh: v } : x))}
              onEn={(v) => setPromises((prev) => prev.map((x, i) => i === idx ? { ...x, titleEn: v } : x))} />
            <BiRow label={isZh ? "描述" : "Description"} zh={p.descZh} en={p.descEn}
              onZh={(v) => setPromises((prev) => prev.map((x, i) => i === idx ? { ...x, descZh: v } : x))}
              onEn={(v) => setPromises((prev) => prev.map((x, i) => i === idx ? { ...x, descEn: v } : x))} multiline />
          </div>
        ))}
      </section>

      <div className="pb-8" />
    </div>
  );
}

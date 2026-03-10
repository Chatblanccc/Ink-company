"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

/* ─── Types ─────────────────────────────────────────────────────────── */

type BiLang = { zh: string; en: string };
type Spec = { label: BiLang; value: BiLang };

export type ProductFormData = {
  id?: string;
  slug: string;
  categorySlug: string;
  title: BiLang;
  summary: BiLang;
  heroTag: BiLang;
  seoTitle: BiLang;
  seoDescription: BiLang;
  applications: BiLang[];
  features: BiLang[];
  specifications: Spec[];
  featured: boolean;
  scenarioTags?: string[];
  coverImage?: string;
  samplingSteps?: BiLang[];
};

type ScenarioTag = { value: string; zh: string; en: string };

type Category = { id: string; slug: string; name: Record<string, string> };

type Props = {
  initial?: ProductFormData;
  categories: Category[];
  availableScenarioTags: ScenarioTag[];
  locale: "zh" | "en";
};

/* ─── Helpers ────────────────────────────────────────────────────────── */

const emptyBi = (): BiLang => ({ zh: "", en: "" });
const emptySpec = (): Spec => ({ label: emptyBi(), value: emptyBi() });

function BiField({
  label,
  valueZh,
  valueEn,
  onChangeZh,
  onChangeEn,
  multiline = false,
  hint,
}: {
  label: string;
  valueZh: string;
  valueEn: string;
  onChangeZh: (v: string) => void;
  onChangeEn: (v: string) => void;
  multiline?: boolean;
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
            rows={multiline ? 3 : undefined}
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono text-slate-400">EN</span>
          <Tag
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            className="border-slate-200 bg-white text-sm"
            rows={multiline ? 3 : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-2 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </h3>
  );
}

/* ─── Main Form ──────────────────────────────────────────────────────── */

export function ProductForm({ initial, categories, availableScenarioTags, locale }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [categorySlug, setCategorySlug] = useState(
    initial?.categorySlug ?? (categories[0]?.slug ?? ""),
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [title, setTitle] = useState<BiLang>(initial?.title ?? emptyBi());
  const [summary, setSummary] = useState<BiLang>(initial?.summary ?? emptyBi());
  const [heroTag, setHeroTag] = useState<BiLang>(initial?.heroTag ?? emptyBi());
  const [seoTitle, setSeoTitle] = useState<BiLang>(initial?.seoTitle ?? emptyBi());
  const [seoDescription, setSeoDescription] = useState<BiLang>(
    initial?.seoDescription ?? emptyBi(),
  );
  const [applications, setApplications] = useState<BiLang[]>(
    initial?.applications.length ? initial.applications : [emptyBi()],
  );
  const [features, setFeatures] = useState<BiLang[]>(
    initial?.features.length ? initial.features : [emptyBi()],
  );
  const [specifications, setSpecifications] = useState<Spec[]>(
    initial?.specifications.length ? initial.specifications : [emptySpec()],
  );
  const [scenarioTags, setScenarioTags] = useState<string[]>(
    initial?.scenarioTags ?? [],
  );
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [samplingSteps, setSamplingSteps] = useState<BiLang[]>(
    initial?.samplingSteps?.length ? initial.samplingSteps : [emptyBi()],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Helpers for array fields ───────────────────────────────────── */

  function updateBiItem(
    arr: BiLang[],
    setter: React.Dispatch<React.SetStateAction<BiLang[]>>,
    idx: number,
    lang: "zh" | "en",
    value: string,
  ) {
    setter(arr.map((item, i) => (i === idx ? { ...item, [lang]: value } : item)));
  }

  function addBiItem(setter: React.Dispatch<React.SetStateAction<BiLang[]>>) {
    setter((prev) => [...prev, emptyBi()]);
  }

  function removeBiItem(setter: React.Dispatch<React.SetStateAction<BiLang[]>>, idx: number) {
    setter((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateSpec(
    idx: number,
    field: "label" | "value",
    lang: "zh" | "en",
    val: string,
  ) {
    setSpecifications((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, [field]: { ...s[field], [lang]: val } } : s,
      ),
    );
  }

  /* ── Submit ──────────────────────────────────────────────────────── */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      slug,
      categorySlug,
      title,
      summary,
      heroTag,
      seoTitle,
      seoDescription,
      applications,
      features,
      specifications,
      featured,
      scenarioTags,
      coverImage: coverImage || null,
      samplingSteps,
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${initial!.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data.error ?? "Unknown error"));
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  const isZh = locale === "zh";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Basic ───────────────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
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
              placeholder="water-based-flexo-ink"
              className="border-slate-200 bg-white font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              {isZh ? "分类" : "Category"}
            </Label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {(c.name as Record<string, string>)[locale] ?? c.slug}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="size-4 rounded border-slate-300"
          />
          <Label htmlFor="featured" className="cursor-pointer text-sm text-slate-700">
            {isZh ? "首页推荐产品" : "Featured on homepage"}
          </Label>
        </div>

        {/* Scenario tags */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            {isZh ? "应用场景标签" : "Application scenario tags"}
            <span className="ml-1 text-xs font-normal text-slate-400">
              {isZh ? "（可多选，用于全部产品页筛选）" : "(multi-select, used for filtering)"}
            </span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {availableScenarioTags.map((tag) => {
              const checked = scenarioTags.includes(tag.value);
              return (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() =>
                    setScenarioTags((prev) =>
                      checked ? prev.filter((t) => t !== tag.value) : [...prev, tag.value],
                    )
                  }
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    checked
                      ? "border-sky-600 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-500 hover:border-sky-400 hover:text-sky-600",
                  ].join(" ")}
                >
                  {isZh ? tag.zh : tag.en}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Copy ────────────────────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "产品文案" : "Product copy"}</SectionTitle>
        <BiField
          label={isZh ? "产品名称" : "Title"}
          valueZh={title.zh}
          valueEn={title.en}
          onChangeZh={(v) => setTitle((p) => ({ ...p, zh: v }))}
          onChangeEn={(v) => setTitle((p) => ({ ...p, en: v }))}
        />
        <BiField
          label={isZh ? "产品摘要" : "Summary"}
          valueZh={summary.zh}
          valueEn={summary.en}
          onChangeZh={(v) => setSummary((p) => ({ ...p, zh: v }))}
          onChangeEn={(v) => setSummary((p) => ({ ...p, en: v }))}
          multiline
        />
        <BiField
          label={isZh ? "英雄标签" : "Hero tag"}
          valueZh={heroTag.zh}
          valueEn={heroTag.en}
          onChangeZh={(v) => setHeroTag((p) => ({ ...p, zh: v }))}
          onChangeEn={(v) => setHeroTag((p) => ({ ...p, en: v }))}
          hint={isZh ? "（卡片顶部小标签）" : "(small badge on product card)"}
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
        />
      </section>

      {/* ── Applications ────────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "应用场景" : "Applications"}</SectionTitle>
        {applications.map((app, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="flex-1">
              <BiField
                label={`#${idx + 1}`}
                valueZh={app.zh}
                valueEn={app.en}
                onChangeZh={(v) => updateBiItem(applications, setApplications, idx, "zh", v)}
                onChangeEn={(v) => updateBiItem(applications, setApplications, idx, "en", v)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeBiItem(setApplications, idx)}
              disabled={applications.length <= 1}
              className="mt-6 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBiItem(setApplications)}
          className="gap-1.5 text-slate-600"
        >
          <Plus className="size-3.5" />
          {isZh ? "添加场景" : "Add application"}
        </Button>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "产品特点" : "Features"}</SectionTitle>
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="flex-1">
              <BiField
                label={`#${idx + 1}`}
                valueZh={feat.zh}
                valueEn={feat.en}
                onChangeZh={(v) => updateBiItem(features, setFeatures, idx, "zh", v)}
                onChangeEn={(v) => updateBiItem(features, setFeatures, idx, "en", v)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeBiItem(setFeatures, idx)}
              disabled={features.length <= 1}
              className="mt-6 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBiItem(setFeatures)}
          className="gap-1.5 text-slate-600"
        >
          <Plus className="size-3.5" />
          {isZh ? "添加特点" : "Add feature"}
        </Button>
      </section>

      {/* ── Specifications ──────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "产品规格" : "Specifications"}</SectionTitle>
        {specifications.map((spec, idx) => (
          <div
            key={idx}
            className="relative rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <Badge className="mb-3 bg-slate-200 text-slate-600 hover:bg-slate-200">
              {isZh ? `规格 ${idx + 1}` : `Spec ${idx + 1}`}
            </Badge>
            <div className="space-y-3">
              <BiField
                label={isZh ? "标签" : "Label"}
                valueZh={spec.label.zh}
                valueEn={spec.label.en}
                onChangeZh={(v) => updateSpec(idx, "label", "zh", v)}
                onChangeEn={(v) => updateSpec(idx, "label", "en", v)}
              />
              <BiField
                label={isZh ? "内容" : "Value"}
                valueZh={spec.value.zh}
                valueEn={spec.value.en}
                onChangeZh={(v) => updateSpec(idx, "value", "zh", v)}
                onChangeEn={(v) => updateSpec(idx, "value", "en", v)}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setSpecifications((prev) => prev.filter((_, i) => i !== idx))
              }
              disabled={specifications.length <= 1}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSpecifications((prev) => [...prev, emptySpec()])}
          className="gap-1.5 text-slate-600"
        >
          <Plus className="size-3.5" />
          {isZh ? "添加规格行" : "Add specification"}
        </Button>
      </section>

      {/* ── Cover Image ─────────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "封面图片" : "Cover image"}</SectionTitle>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            {isZh ? "图片 URL" : "Image URL"}
            <span className="ml-1 text-xs font-normal text-slate-400">
              {isZh ? "（建议 1400×1750px，4:5 比例）" : "(recommended 1400×1750px, 4:5 ratio)"}
            </span>
          </Label>
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="border-slate-200 bg-white font-mono text-sm"
          />
        </div>
        {coverImage && (
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-100" style={{ maxHeight: 180 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="cover preview"
              className="h-[180px] w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </section>

      {/* ── Sampling Steps ───────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "打样流程说明" : "Sampling steps"}</SectionTitle>
        <p className="text-xs text-slate-400">
          {isZh
            ? '在产品详情页「打样说明」Tab 中展示，按顺序排列。'
            : 'Shown in the "Sampling" tab on the product detail page, in order.'}
        </p>
        {samplingSteps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="flex-1">
              <BiField
                label={`${isZh ? "步骤" : "Step"} ${idx + 1}`}
                valueZh={step.zh}
                valueEn={step.en}
                onChangeZh={(v) =>
                  setSamplingSteps((prev) =>
                    prev.map((s, i) => (i === idx ? { ...s, zh: v } : s)),
                  )
                }
                onChangeEn={(v) =>
                  setSamplingSteps((prev) =>
                    prev.map((s, i) => (i === idx ? { ...s, en: v } : s)),
                  )
                }
                multiline
              />
            </div>
            <button
              type="button"
              onClick={() => setSamplingSteps((prev) => prev.filter((_, i) => i !== idx))}
              disabled={samplingSteps.length <= 1}
              className="mt-6 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSamplingSteps((prev) => [...prev, emptyBi()])}
          className="gap-1.5 text-slate-600"
        >
          <Plus className="size-3.5" />
          {isZh ? "添加步骤" : "Add step"}
        </Button>
      </section>

      {/* ── Submit ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
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
            isZh ? "创建产品" : "Create product"
          )}
        </Button>
      </div>
    </form>
  );
}

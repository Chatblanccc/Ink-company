"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2, CheckCircle2, ImageIcon } from "lucide-react";
import type { HomepageData, BiLang } from "@/lib/homepage-defaults";
import type { AdminLocale } from "@/lib/admin-i18n";

type Props = {
  initialData: HomepageData;
  locale: AdminLocale;
};

function BiField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: BiLang;
  onChange: (v: BiLang) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">中文</Label>
          {multiline ? (
            <Textarea rows={rows} value={value.zh} onChange={(e) => onChange({ ...value, zh: e.target.value })} className="resize-none text-sm" />
          ) : (
            <Input value={value.zh} onChange={(e) => onChange({ ...value, zh: e.target.value })} className="text-sm" />
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">English</Label>
          {multiline ? (
            <Textarea rows={rows} value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} className="resize-none text-sm" />
          ) : (
            <Input value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} className="text-sm" />
          )}
        </div>
      </div>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</Label>
      <div className="flex gap-3">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="size-6 text-slate-300" />
            </div>
          )}
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="text-sm font-mono"
        />
      </div>
    </div>
  );
}

export function HomepageForm({ initialData, locale }: Props) {
  const [data, setData] = useState<HomepageData>(initialData);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const isZh = locale === "zh";

  function patch<K extends keyof HomepageData>(key: K, value: HomepageData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/homepage", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) setSaved(true);
      } catch {
        // handle error silently
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Sticky save bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 shadow-sm backdrop-blur">
        <p className="text-sm font-medium text-slate-700">
          {isZh ? "首页内容管理" : "Homepage Content"}
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

      {/* ── Hero ── */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "Hero 主标题" : "Hero Title"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BiField
            label={isZh ? "主标题" : "Title"}
            value={data.hero.title}
            onChange={(v) => patch("hero", { title: v })}
          />
        </CardContent>
      </Card>

      {/* ── Device Screen ── */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "首页设备屏幕数据（Hero iPad / 手机图）" : "Hero Device Screen Data"}
          </CardTitle>
          <p className="text-sm text-slate-400">
            {isZh ? "对应首页 Hero 区域的设备屏幕内显示的仪表盘数据。" : "The dashboard data shown inside the device mockup in the Hero section."}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <BiField
            label={isZh ? "标签行（如「色彩管控 • 概览」）" : "Label row (e.g. \"Color Control • Overview\")"}
            value={data.device.label}
            onChange={(v) => patch("device", { ...data.device, label: v })}
          />
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              {isZh ? "核心数值（如「99.2%」）" : "Main value (e.g. \"99.2%\")"}
            </Label>
            <Input
              value={data.device.value}
              onChange={(e) => patch("device", { ...data.device, value: e.target.value })}
              className="w-48 text-sm font-mono"
              placeholder="99.2%"
            />
          </div>
          <BiField
            label={isZh ? "指标名称（如「批次色差合格率」）" : "Metric label (e.g. \"Batch Pass Rate\")"}
            value={data.device.metric}
            onChange={(v) => patch("device", { ...data.device, metric: v })}
          />
          <BiField
            label={isZh ? "筛选标签（如「全部产品线 (8)」）" : "Filter label (e.g. \"All Products (8)\")"}
            value={data.device.filter}
            onChange={(v) => patch("device", { ...data.device, filter: v })}
          />
        </CardContent>
      </Card>

      {/* ── Benefits ── */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "核心优势版块" : "Benefits Section"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BiField label={isZh ? "标签行" : "Eyebrow"} value={data.benefits.eyebrow} onChange={(v) => patch("benefits", { ...data.benefits, eyebrow: v })} />
          <BiField label={isZh ? "大标题" : "Heading"} value={data.benefits.heading} onChange={(v) => patch("benefits", { ...data.benefits, heading: v })} />
          <BiField label={isZh ? "描述" : "Subtext"} value={data.benefits.sub} onChange={(v) => patch("benefits", { ...data.benefits, sub: v })} multiline rows={2} />

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {isZh ? "4 张特性卡片" : "4 Feature Cards"}
            </p>
            {data.benefits.cards.map((card, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-500">{isZh ? `卡片 ${i + 1}` : `Card ${i + 1}`}</p>
                <BiField
                  label={isZh ? "标题" : "Title"}
                  value={card.title}
                  onChange={(v) => {
                    const newCards = [...data.benefits.cards];
                    newCards[i] = { ...card, title: v };
                    patch("benefits", { ...data.benefits, cards: newCards });
                  }}
                />
                <BiField
                  label={isZh ? "描述" : "Text"}
                  value={card.text}
                  onChange={(v) => {
                    const newCards = [...data.benefits.cards];
                    newCards[i] = { ...card, text: v };
                    patch("benefits", { ...data.benefits, cards: newCards });
                  }}
                  multiline
                  rows={2}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Big Picture ── */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "\"从配方到量产\" 版块" : "\"From Formula to Full Run\" Section"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BiField label={isZh ? "大标题" : "Heading"} value={data.bigPicture.heading} onChange={(v) => patch("bigPicture", { ...data.bigPicture, heading: v })} />
          <BiField label={isZh ? "描述" : "Subtext"} value={data.bigPicture.sub} onChange={(v) => patch("bigPicture", { ...data.bigPicture, sub: v })} multiline rows={2} />
          <BiField label={isZh ? "按钮文字" : "CTA Button"} value={data.bigPicture.cta} onChange={(v) => patch("bigPicture", { ...data.bigPicture, cta: v })} />

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {isZh ? "4 个步骤" : "4 Steps"}
            </p>
            {data.bigPicture.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                <span className="mt-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{step.num}</span>
                <div className="flex-1 space-y-2">
                  <BiField
                    label={isZh ? `步骤 ${i + 1}` : `Step ${i + 1}`}
                    value={step.title}
                    onChange={(v) => {
                      const newSteps = [...data.bigPicture.steps];
                      newSteps[i] = { ...step, title: v };
                      patch("bigPicture", { ...data.bigPicture, steps: newSteps });
                    }}
                    multiline
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Specs ── */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "产品体系版块" : "Product Range Section"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BiField label={isZh ? "标签行" : "Eyebrow"} value={data.specs.eyebrow} onChange={(v) => patch("specs", { ...data.specs, eyebrow: v })} />
          <BiField label={isZh ? "大标题" : "Heading"} value={data.specs.heading} onChange={(v) => patch("specs", { ...data.specs, heading: v })} />
          <BiField label={isZh ? "描述" : "Subtext"} value={data.specs.sub} onChange={(v) => patch("specs", { ...data.specs, sub: v })} multiline rows={2} />
          <BiField label={isZh ? "按钮文字" : "CTA Button"} value={data.specs.cta} onChange={(v) => patch("specs", { ...data.specs, cta: v })} />
        </CardContent>
      </Card>

      {/* ── Testimonial ── */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "客户见证" : "Testimonial"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BiField label={isZh ? "引用内容" : "Quote"} value={data.testimonial.quote} onChange={(v) => patch("testimonial", { ...data.testimonial, quote: v })} multiline rows={3} />
          <BiField label={isZh ? "姓名" : "Author"} value={data.testimonial.author} onChange={(v) => patch("testimonial", { ...data.testimonial, author: v })} />
          <BiField label={isZh ? "职位" : "Role"} value={data.testimonial.role} onChange={(v) => patch("testimonial", { ...data.testimonial, role: v })} />
        </CardContent>
      </Card>

      {/* ── How To ── */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "合作流程版块" : "How to Work With Us"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BiField label={isZh ? "大标题" : "Heading"} value={data.howTo.heading} onChange={(v) => patch("howTo", { ...data.howTo, heading: v })} />
          <BiField label={isZh ? "按钮文字" : "CTA Button"} value={data.howTo.cta} onChange={(v) => patch("howTo", { ...data.howTo, cta: v })} />

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {isZh ? "3 个步骤" : "3 Steps"}
            </p>
            {data.howTo.steps.map((step, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-500">{isZh ? `步骤 ${i + 1}` : `Step ${i + 1}`}</p>
                <BiField
                  label={isZh ? "步骤标题" : "Title"}
                  value={step.title}
                  onChange={(v) => {
                    const newSteps = [...data.howTo.steps];
                    newSteps[i] = { ...step, title: v };
                    patch("howTo", { ...data.howTo, steps: newSteps });
                  }}
                />
                <BiField
                  label={isZh ? "步骤描述" : "Description"}
                  value={step.text}
                  onChange={(v) => {
                    const newSteps = [...data.howTo.steps];
                    newSteps[i] = { ...step, text: v };
                    patch("howTo", { ...data.howTo, steps: newSteps });
                  }}
                  multiline
                  rows={2}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── CTA ── */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "底部 CTA 版块" : "Bottom CTA Section"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BiField label={isZh ? "大标题" : "Heading"} value={data.cta.heading} onChange={(v) => patch("cta", { ...data.cta, heading: v })} />
          <BiField label={isZh ? "描述" : "Subtext"} value={data.cta.sub} onChange={(v) => patch("cta", { ...data.cta, sub: v })} multiline rows={2} />
          <BiField label={isZh ? "按钮文字" : "Button"} value={data.cta.btn} onChange={(v) => patch("cta", { ...data.cta, btn: v })} />
        </CardContent>
      </Card>

      {/* ── Images ── */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-950">
            {isZh ? "背景图片 URL" : "Background Images"}
          </CardTitle>
          <p className="text-sm text-slate-400">
            {isZh ? "填写图片的完整 URL 地址，支持 Unsplash、CDN 等任意来源。" : "Paste full image URLs from Unsplash, CDN, or any source."}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <ImageField
            label={isZh ? "Hero / 手机端背景图" : "Hero / Mobile BG"}
            value={data.images.hero}
            onChange={(v) => patch("images", { ...data.images, hero: v })}
          />
          <ImageField
            label={isZh ? "核心优势版块大图" : "Benefits Section Image"}
            value={data.images.benefits}
            onChange={(v) => patch("images", { ...data.images, benefits: v })}
          />
          <ImageField
            label={isZh ? "\"从配方到量产\" 版块右侧图" : "Big Picture Right Image"}
            value={data.images.bigPicture}
            onChange={(v) => patch("images", { ...data.images, bigPicture: v })}
          />
          <ImageField
            label={isZh ? "客户见证版块图" : "Testimonial Image"}
            value={data.images.testimonial}
            onChange={(v) => patch("images", { ...data.images, testimonial: v })}
          />
          <ImageField
            label={isZh ? "全宽装饰大图" : "Full-width Decorative Image"}
            value={data.images.fullwidth}
            onChange={(v) => patch("images", { ...data.images, fullwidth: v })}
          />
        </CardContent>
      </Card>
    </div>
  );
}

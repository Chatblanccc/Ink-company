"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { CheckCircle2, Loader2, Plus, Save, Trash2, GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AboutPageData, AboutHeroCard, AboutStat, AboutTeamMember, AboutValue } from "@/lib/about-page-defaults";

/* ─── Shared UI helpers ──────────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-2 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </h3>
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

const ICON_OPTIONS = ["Target", "Zap", "ShieldCheck", "Globe", "Users", "Sparkles", "Star", "Award", "Leaf", "Layers"];

type Props = {
  initial: AboutPageData;
  locale: "zh" | "en";
};

export function AboutPageForm({ initial, locale }: Props) {
  const isZh = locale === "zh";

  const [hero,      setHero]      = useState(initial.hero);
  const [heroCards, setHeroCards] = useState<AboutHeroCard[]>(initial.heroCards);
  const [stats,     setStats]     = useState<AboutStat[]>(initial.stats);
  const [team,   setTeam]   = useState<AboutTeamMember[]>(initial.team);
  const [values, setValues] = useState<AboutValue[]>(initial.values);
  const [cta,    setCta]    = useState(initial.cta);

  const [isPending, startTransition] = useTransition();
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  function handleSave() {
    startTransition(async () => {
      setSaved(false);
      setError(null);
      try {
        const res = await fetch("/api/admin/about-page", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero, heroCards, stats, team, values, cta }),
        });
        if (!res.ok) throw new Error("Save failed");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      }
    });
  }

  /* ── Hero card helpers ── */
  function updateHeroCard(i: number, patch: Partial<AboutHeroCard>) {
    setHeroCards((prev) => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  }

  /* ── Stats helpers ── */
  function updateStat(i: number, patch: Partial<AboutStat>) {
    setStats((prev) => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  }
  function addStat() {
    setStats((prev) => [...prev, { value: "", labelZh: "", labelEn: "" }]);
  }
  function removeStat(i: number) {
    setStats((prev) => prev.filter((_, idx) => idx !== i));
  }

  /* ── Team helpers ── */
  function updateMember(i: number, patch: Partial<AboutTeamMember>) {
    setTeam((prev) => prev.map((m, idx) => idx === i ? { ...m, ...patch } : m));
  }
  function addMember() {
    setTeam((prev) => [...prev, { src: "", nameZh: "", nameEn: "", roleZh: "", roleEn: "" }]);
  }
  function removeMember(i: number) {
    setTeam((prev) => prev.filter((_, idx) => idx !== i));
  }

  /* ── Values helpers ── */
  function updateValue(i: number, patch: Partial<AboutValue>) {
    setValues((prev) => prev.map((v, idx) => idx === i ? { ...v, ...patch } : v));
  }
  function addValue() {
    setValues((prev) => [...prev, { icon: "Target", titleZh: "", titleEn: "", textZh: "", textEn: "" }]);
  }
  function removeValue(i: number) {
    setValues((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-8">
      {/* Sentinel: when this scrolls out of view the pill button appears */}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      {/* ── Sticky save bar ─────────────────────────────────────── */}
      <div className="sticky top-[60px] z-10 flex">
        <div className={`flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 shadow-sm backdrop-blur transition-all duration-300 ease-in-out ${isScrolled ? "pointer-events-none opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          <p className="text-sm font-medium text-slate-700">
            {isZh ? "关于我们页面内容" : "About page content"}
          </p>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${saved ? "bg-emerald-500 hover:bg-emerald-500 text-white" : "bg-slate-950 hover:bg-slate-800 text-white"}`}
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
        <button
          onClick={handleSave}
          disabled={isPending}
          title={isZh ? "保存更改" : "Save changes"}
          className={`absolute right-0 top-7 flex size-11 items-center justify-center rounded-full border shadow-lg backdrop-blur transition-all duration-300 ease-in-out ${isScrolled ? "pointer-events-auto opacity-100 scale-100" : "pointer-events-none opacity-0 scale-75"} ${saved ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : isPending ? "border-slate-200 bg-white/90 text-slate-400" : "border-slate-200 bg-slate-950 text-white hover:bg-slate-800"}`}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : saved ? <CheckCircle2 className="size-4" /> : <Save className="size-4" />}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* ── Section 1: Hero ─────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "顶部 Hero 区域" : "Hero section"}</SectionTitle>
        <BiRow
          label={isZh ? "主标题" : "Main heading"}
          zh={hero.headingZh} en={hero.headingEn}
          onZh={(v) => setHero((p) => ({ ...p, headingZh: v }))}
          onEn={(v) => setHero((p) => ({ ...p, headingEn: v }))}
          multiline
        />
        <BiRow
          label={isZh ? "正文段落 1" : "Body paragraph 1"}
          zh={hero.body1Zh} en={hero.body1En}
          onZh={(v) => setHero((p) => ({ ...p, body1Zh: v }))}
          onEn={(v) => setHero((p) => ({ ...p, body1En: v }))}
          multiline
        />
        <BiRow
          label={isZh ? "正文段落 2" : "Body paragraph 2"}
          zh={hero.body2Zh} en={hero.body2En}
          onZh={(v) => setHero((p) => ({ ...p, body2Zh: v }))}
          onEn={(v) => setHero((p) => ({ ...p, body2En: v }))}
          multiline
        />
      </section>

      {/* ── Section 1b: Hero Photo Cards ────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <SectionTitle>{isZh ? "Hero 悬浮照片卡片（桌面端）" : "Hero floating photo cards (desktop)"}</SectionTitle>
            <p className="mt-2 text-xs text-slate-400">
              {isZh
                ? "右侧两张叠加展示的人物卡片，仅在桌面端显示，布局位置固定（左下 / 右上）。"
                : "The two overlapping portrait cards on the right, desktop only. Layout positions are fixed (bottom-left / top-right)."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {heroCards.map((card, i) => (
            <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-500">
                  {i === 0
                    ? (isZh ? "右上角" : "top-right")
                    : (isZh ? "左下角" : "bottom-left")}
                </span>
              </div>

              {/* Photo preview + URL */}
              <div className="flex items-start gap-3">
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-sm">
                  {card.src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={card.src} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-slate-500">{isZh ? "照片 URL" : "Photo URL"}</Label>
                  <Input
                    value={card.src}
                    onChange={(e) => updateHeroCard(i, { src: e.target.value })}
                    className="h-8 border-slate-200 bg-white text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">ZH 姓名</span>
                  <Input value={card.nameZh} onChange={(e) => updateHeroCard(i, { nameZh: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">EN Name</span>
                  <Input value={card.nameEn} onChange={(e) => updateHeroCard(i, { nameEn: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">ZH 职位</span>
                  <Input value={card.roleZh} onChange={(e) => updateHeroCard(i, { roleZh: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">EN Role</span>
                  <Input value={card.roleEn} onChange={(e) => updateHeroCard(i, { roleEn: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: Stats ────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <SectionTitle>{isZh ? "数据亮点（深色横幅）" : "Stats bar (dark band)"}</SectionTitle>
          <button
            type="button"
            onClick={addStat}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
          >
            <Plus className="size-3.5" />
            {isZh ? "添加" : "Add"}
          </button>
        </div>

        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
              <GripVertical className="mt-2 size-4 shrink-0 text-slate-300" />
              <div className="flex flex-1 flex-col gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">{isZh ? "数值" : "Value"}</Label>
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(i, { value: e.target.value })}
                    className="h-8 border-slate-200 bg-white text-sm font-mono"
                    placeholder="28+"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">ZH</span>
                    <Input value={stat.labelZh} onChange={(e) => updateStat(i, { labelZh: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" placeholder="服务市场" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">EN</span>
                    <Input value={stat.labelEn} onChange={(e) => updateStat(i, { labelEn: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" placeholder="Markets served" />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="mt-1 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Team ─────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <SectionTitle>{isZh ? "团队成员" : "Team members"}</SectionTitle>
          <button
            type="button"
            onClick={addMember}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
          >
            <Plus className="size-3.5" />
            {isZh ? "添加成员" : "Add member"}
          </button>
        </div>

        <div className="space-y-4">
          {team.map((member, i) => (
            <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-400">#{i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeMember(i)}
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Photo preview + URL */}
              <div className="mb-3 flex items-center gap-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                  {member.src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.src} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-slate-500">{isZh ? "照片 URL" : "Photo URL"}</Label>
                  <Input
                    value={member.src}
                    onChange={(e) => updateMember(i, { src: e.target.value })}
                    className="h-8 border-slate-200 bg-white text-xs"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">ZH 姓名</span>
                  <Input value={member.nameZh} onChange={(e) => updateMember(i, { nameZh: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">EN Name</span>
                  <Input value={member.nameEn} onChange={(e) => updateMember(i, { nameEn: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">ZH 职位</span>
                  <Input value={member.roleZh} onChange={(e) => updateMember(i, { roleZh: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">EN Role</span>
                  <Input value={member.roleEn} onChange={(e) => updateMember(i, { roleEn: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Values ───────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <SectionTitle>{isZh ? "核心价值观" : "Core values"}</SectionTitle>
          <button
            type="button"
            onClick={addValue}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
          >
            <Plus className="size-3.5" />
            {isZh ? "添加" : "Add"}
          </button>
        </div>

        <div className="space-y-4">
          {values.map((val, i) => (
            <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-400">#{i + 1}</span>
                  <div className="space-y-0.5">
                    <Label className="text-xs text-slate-500">{isZh ? "图标" : "Icon"}</Label>
                    <select
                      value={val.icon}
                      onChange={(e) => updateValue(i, { icon: e.target.value })}
                      className="h-7 rounded border border-slate-200 bg-white px-2 text-xs text-slate-700"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeValue(i)}
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">ZH 标题</span>
                    <Input value={val.titleZh} onChange={(e) => updateValue(i, { titleZh: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">EN Title</span>
                    <Input value={val.titleEn} onChange={(e) => updateValue(i, { titleEn: e.target.value })} className="h-8 border-slate-200 bg-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">ZH 描述</span>
                    <Textarea value={val.textZh} onChange={(e) => updateValue(i, { textZh: e.target.value })} rows={2} className="border-slate-200 bg-white text-sm" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">EN Description</span>
                    <Textarea value={val.textEn} onChange={(e) => updateValue(i, { textEn: e.target.value })} rows={2} className="border-slate-200 bg-white text-sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA ──────────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <SectionTitle>{isZh ? "底部召唤行动（加入团队）" : "Bottom CTA (Join our team)"}</SectionTitle>
        <BiRow
          label={isZh ? "标题" : "Heading"}
          zh={cta.headingZh} en={cta.headingEn}
          onZh={(v) => setCta((p) => ({ ...p, headingZh: v }))}
          onEn={(v) => setCta((p) => ({ ...p, headingEn: v }))}
        />
        <BiRow
          label={isZh ? "正文" : "Body text"}
          zh={cta.bodyZh} en={cta.bodyEn}
          onZh={(v) => setCta((p) => ({ ...p, bodyZh: v }))}
          onEn={(v) => setCta((p) => ({ ...p, bodyEn: v }))}
          multiline
        />
      </section>

    </div>
  );
}

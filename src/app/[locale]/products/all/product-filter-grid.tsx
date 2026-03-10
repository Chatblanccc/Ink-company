"use client";

import { useState } from "react";
import Link from "next/link";

type ProductRow = {
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  category: Record<string, string>;
  featured: boolean;
  scenarioTags: string[];
  coverImage: string | null;
};

type ScenarioLabels = Record<string, { zh: string; en: string }>;

type Props = {
  products: ProductRow[];
  locale: "zh" | "en";
  defaultImages: Record<string, string>;
  fallbackImg: string;
  initialScenario: string | null;
  scenarioLabels: ScenarioLabels;
};

const SCENARIO_ORDER = ["packaging", "labels", "publishing", "industrial", "specialty"];

export function ProductFilterGrid({
  products,
  locale: c,
  defaultImages,
  fallbackImg,
  initialScenario,
  scenarioLabels,
}: Props) {

  /* ── Filter state ─────────────────────────────────────────────────
     Two independent axes: ink category OR scenario tag (not both at once,
     keeping the UI simple with a single active pill).
  ──────────────────────────────────────────────────────────────────── */
  const [active, setActive] = useState<string | null>(initialScenario);

  /* ── Unique ink categories present in the product list ───────────── */
  const inkCategories = Array.from(
    new Map(
      products.map((p) => [p.category[c] ?? p.category.en, p.category]),
    ).values(),
  );

  /* ── Scenario tags that actually appear in at least one product ───── */
  const usedScenarios = SCENARIO_ORDER.filter((key) =>
    products.some((p) => p.scenarioTags.includes(key)),
  );

  /* ── Filtered product list ─────────────────────────────────────────
     If active matches an ink-category label → filter by ink category.
     If active matches a scenario label → filter by scenario key.
  ──────────────────────────────────────────────────────────────────── */
  const inkCategoryLabels = new Set(inkCategories.map((cat) => cat[c] ?? cat.en));
  const scenarioLabelToKey = Object.fromEntries(
    Object.entries(scenarioLabels).map(([k, v]) => [v[c], k]),
  );

  const visible = active
    ? inkCategoryLabels.has(active)
      ? products.filter((p) => (p.category[c] ?? p.category.en) === active)
      : products.filter((p) => {
          const key = scenarioLabelToKey[active];
          return key ? p.scenarioTags.includes(key) : true;
        })
    : products;

  const hasScenarioFilter = usedScenarios.length > 0;
  const hasInkFilter = inkCategories.length > 1;

  return (
    <>
      {/* ── Filter strip ────────────────────────────────────────────── */}
      {(hasInkFilter || hasScenarioFilter) && (
        <section className="w-full border-b border-[#EFEFEF] sticky top-[60px] bg-white/95 backdrop-blur-sm z-10">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
            <div className="flex items-center gap-[6px] py-[12px] overflow-x-auto no-scrollbar">

              {/* "All" pill */}
              <Pill
                label={c === "zh" ? "全部" : "All"}
                count={products.length}
                active={active === null}
                onClick={() => setActive(null)}
              />

              {/* Divider when both filter groups exist */}
              {hasInkFilter && hasScenarioFilter && (
                <span className="shrink-0 w-px h-4 bg-[#E9E9E9] mx-1" />
              )}

              {/* Ink-type category pills */}
              {hasInkFilter && inkCategories.map((cat) => {
                const label = cat[c] ?? cat.en;
                const count = products.filter(
                  (p) => (p.category[c] ?? p.category.en) === label,
                ).length;
                return (
                  <Pill
                    key={label}
                    label={label}
                    count={count}
                    active={active === label}
                    onClick={() => setActive(active === label ? null : label)}
                  />
                );
              })}

              {/* Divider before scenario pills */}
              {hasInkFilter && hasScenarioFilter && (
                <span className="shrink-0 w-px h-4 bg-[#E9E9E9] mx-1" />
              )}

              {/* Scenario tag pills */}
              {hasScenarioFilter && usedScenarios.map((key) => {
                const label = scenarioLabels[key][c];
                const count = products.filter((p) => p.scenarioTags.includes(key)).length;
                return (
                  <Pill
                    key={key}
                    label={label}
                    count={count}
                    active={active === label}
                    onClick={() => setActive(active === label ? null : label)}
                    variant="scenario"
                  />
                );
              })}

            </div>
          </div>
        </section>
      )}

      {/* ── Products grid ─────────────────────────────────────────────── */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-[48px] lg:py-[72px]">
        {active && (
          <p className="text-[12px] font-mono text-[#929292] mb-[24px] lg:mb-[32px]">
            {c === "zh"
              ? `「${active}」— 共 ${visible.length} 款`
              : `"${active}" — ${visible.length} product${visible.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px] gap-[12px] text-center">
            <p className="text-[32px] font-display text-[#E9E9E9]">—</p>
            <p className="text-[14px] text-[#929292]">
              {c === "zh" ? "该分类暂无产品" : "No products in this category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-[12px] lg:gap-x-[16px] gap-y-[32px] lg:gap-y-[48px]">
            {visible.map((product) => {
              const img =
                product.coverImage ??
                defaultImages[product.slug] ??
                fallbackImg;
              return (
                <Link
                  key={product.slug}
                  href={`/${c}/products/${product.slug}`}
                  className="group flex flex-col gap-[12px] lg:gap-[14px]"
                >
                  <div className="relative w-full aspect-[3/4] rounded-[10px] lg:rounded-[12px] overflow-hidden bg-[#F3F3F3]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                    {product.featured && (
                      <div className="absolute top-[10px] left-[10px] bg-[#485C11] text-white text-[9px] font-bold tracking-[0.06em] uppercase px-[8px] py-[4px] rounded-full">
                        {c === "zh" ? "推荐" : "Featured"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <p className="font-mono text-[10px] lg:text-[11px] text-[#929292] tracking-[-0.01em]">
                      {product.category[c]}
                    </p>
                    <h2 className="font-bold text-[13px] lg:text-[14px] leading-[1.35] tracking-[-0.02em] text-[#000] group-hover:text-[#485C11] transition-colors duration-200">
                      {product.title[c]}
                    </h2>
                    <p className="text-[12px] lg:text-[13px] leading-[1.5] text-[#929292] mt-[2px]">
                      {(product.summary[c] ?? "").slice(0, 52)}…
                    </p>
                    {/* Scenario tags on card */}
                    {product.scenarioTags.length > 0 && (
                      <div className="flex flex-wrap gap-[4px] mt-[4px]">
                        {product.scenarioTags.map((key) => (
                          scenarioLabels[key] && (
                            <span
                              key={key}
                              className="inline-flex items-center px-[6px] py-[2px] rounded-full bg-[#F3F3F3] text-[9px] font-medium text-[#6F6F6F] tracking-[0.02em]"
                            >
                              {scenarioLabels[key][c]}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

/* ─── Pill button ────────────────────────────────────────────────────── */

function Pill({
  label,
  count,
  active,
  onClick,
  variant = "ink",
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  variant?: "ink" | "scenario";
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "shrink-0 inline-flex items-center px-[14px] py-[6px] rounded-full border text-[12px] font-medium transition-all duration-200",
        active
          ? "border-[#485C11] bg-[#485C11] text-white"
          : variant === "scenario"
          ? "border-dashed border-[#CFCFCF] text-[#6F6F6F] hover:border-[#485C11] hover:text-[#485C11]"
          : "border-[#E9E9E9] text-[#6F6F6F] hover:border-[#485C11] hover:text-[#485C11]",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "ml-[6px] text-[10px] font-mono tabular-nums",
          active ? "text-white/70" : "text-[#929292]",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/demo-data";
import type { Locale } from "@/lib/i18n";

type Tab = "description" | "specifications" | "sampling";

const TABS: { id: Tab; label: Record<Locale, string> }[] = [
  { id: "description",    label: { zh: "产品详情", en: "Description" } },
  { id: "specifications", label: { zh: "规格参数", en: "Specifications" } },
  { id: "sampling",       label: { zh: "打样说明", en: "Sampling" } },
];

const SAMPLING_STEPS: Record<Locale, string[]> = {
  zh: [
    "提交需求：填写您的基材类型、印刷设备与色彩目标，工程师 48 小时内回复。",
    "配方确认：我们根据您的工艺参数给出初步配方方向。",
    "实机打样：72 小时内完成实机验证，并提供色差数据报告。",
    "方案落地：确认配方后，即可进入小批试产或量产阶段。",
  ],
  en: [
    "Submit your brief: share your substrate, press type, and color targets — engineers respond within 48 hours.",
    "Formulation review: we propose an initial formulation direction based on your process parameters.",
    "On-press proof: completed within 72 hours, with a full color deviation report.",
    "Scale up: once the formulation is confirmed, move directly to pilot or full production.",
  ],
};

export function ProductDetailTabs({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const [active, setActive] = useState<Tab>("description");

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Tab nav */}
      <div className="flex gap-[0px] border-b border-[#DDDBD8]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`pb-[12px] mr-[24px] text-[13px] font-medium leading-[1.3] tracking-[-0.01em] border-b-2 transition-colors duration-150 ${
              active === tab.id
                ? "border-[#000] text-[#000]"
                : "border-transparent text-[#929292] hover:text-[#000]"
            }`}
          >
            {tab.label[locale]}
          </button>
        ))}
      </div>

      {/* Description tab */}
      {active === "description" && (
        <div className="flex flex-col gap-[16px]">
          <p className="text-[14px] leading-[1.7] tracking-[-0.005em] text-[#6F6F6F]">
            {product.summary[locale]}
          </p>
          <ul className="flex flex-col gap-[8px]">
            {product.features.map((f) => (
              <li
                key={f.en}
                className="flex items-start gap-[10px] text-[13px] lg:text-[14px] leading-[1.55] tracking-[-0.005em] text-[#000]"
              >
                <span className="mt-[5px] shrink-0 w-[5px] h-[5px] rounded-full bg-[#485C11]" />
                {f[locale]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specifications tab */}
      {active === "specifications" && (
        <div className="flex flex-col gap-[0px]">
          {product.specifications.map((spec, i) => (
            <div
              key={spec.label.en}
              className={`flex items-start justify-between gap-[16px] py-[14px] ${
                i < product.specifications.length - 1 ? "border-b border-[#EFEFED]" : ""
              }`}
            >
              <span className="text-[12px] font-medium text-[#929292] tracking-[-0.01em] shrink-0 w-[120px]">
                {spec.label[locale]}
              </span>
              <span className="text-[13px] text-[#000] leading-[1.5] text-right">
                {spec.value[locale]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Sampling tab */}
      {active === "sampling" && (
        <div className="flex flex-col gap-[20px]">
          <p className="text-[14px] leading-[1.7] text-[#6F6F6F]">
            {locale === "zh"
              ? "我们提供 72 小时实机验证打样服务。以下是完整的合作流程："
              : "We offer 72-hour on-press proof sampling. Here's how the process works:"}
          </p>
          <ol className="flex flex-col gap-[12px]">
            {SAMPLING_STEPS[locale].map((step, i) => (
              <li key={i} className="flex items-start gap-[12px]">
                <span className="shrink-0 font-bold text-[11px] text-[#485C11] bg-[#DFECC6] rounded-full w-[20px] h-[20px] flex items-center justify-center mt-[1px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[13px] lg:text-[14px] leading-[1.6] text-[#000]">{step}</p>
              </li>
            ))}
          </ol>
          <Link
            href={`/${locale}/contact`}
            className="mt-[4px] inline-flex w-full items-center justify-center bg-[#000] text-white text-[13px] font-bold py-[13px] rounded-full hover:bg-[#1a1a1a] transition-colors"
          >
            {locale === "zh" ? "申请打样" : "Request a sample"}
          </Link>
        </div>
      )}
    </div>
  );
}

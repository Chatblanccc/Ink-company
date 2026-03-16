"use client";

import type { Locale } from "@/lib/i18n";

type HeroCard = {
  src: string;
  nameZh: string;
  nameEn: string;
  roleZh: string;
  roleEn: string;
};

const DEFAULT_CARDS: HeroCard[] = [
  {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=700&auto=format&fit=crop",
    nameZh: "陈工程师", nameEn: "Dr. Chen Wei",
    roleZh: "色彩科学总监", roleEn: "Head of Color Science",
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=700&auto=format&fit=crop",
    nameZh: "Maria Chen", nameEn: "Maria Chen",
    roleZh: "国际客户总监", roleEn: "Client Relations Director",
  },
];

const LAYOUT = [
  { wrapClass: "absolute right-0 top-0 z-[1] hover:z-[10]", width: "58%", height: "300px" },
  { wrapClass: "absolute left-0 bottom-0 z-[2] hover:z-[10]", width: "53%", height: "270px" },
] as const;

type Props = {
  locale: Locale;
  cards?: HeroCard[];
};

export function HeroPhotoCards({ locale, cards }: Props) {
  const data = cards && cards.length >= 2 ? cards : DEFAULT_CARDS;

  return (
    <div className="relative" style={{ height: "500px" }}>
      {data.slice(0, 2).map((card, i) => {
        const { wrapClass, width, height } = LAYOUT[i];
        return (
          <div
            key={i}
            className={`group cursor-pointer transition-[z-index] ${wrapClass}`}
            style={{ width }}
          >
            <div
              className="relative w-full rounded-[20px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
              style={{ height }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${card.src})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-[10px] px-[18px] py-[16px] opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-bold text-[14px] leading-[1.2] tracking-[-0.025em] text-white">
                  {locale === "zh" ? card.nameZh : card.nameEn}
                </p>
                <p className="font-mono text-[10px] text-white/65 mt-[4px]">
                  {locale === "zh" ? card.roleZh : card.roleEn}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

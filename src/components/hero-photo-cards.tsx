"use client";

import type { Locale } from "@/lib/i18n";

const CARDS = [
  {
    id: "card1",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=700&auto=format&fit=crop",
    name: { zh: "陈工程师", en: "Dr. Chen Wei" },
    role: { zh: "色彩科学总监", en: "Head of Color Science" },
    wrapClass: "absolute right-0 top-0 z-[1] hover:z-[10]",
    width: "58%",
    height: "300px",
  },
  {
    id: "card2",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=700&auto=format&fit=crop",
    name: { zh: "Maria Chen", en: "Maria Chen" },
    role: { zh: "国际客户总监", en: "Client Relations Director" },
    wrapClass: "absolute left-0 bottom-0 z-[2] hover:z-[10]",
    width: "53%",
    height: "270px",
  },
] as const;

export function HeroPhotoCards({ locale }: { locale: Locale }) {
  return (
    <div className="relative" style={{ height: "500px" }}>
      {CARDS.map((card) => (
        <div
          key={card.id}
          className={`group cursor-pointer transition-[z-index] ${card.wrapClass}`}
          style={{ width: card.width }}
        >
          {/* Photo — overflow-hidden stays on the photo div only */}
          <div
            className="relative w-full rounded-[20px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            style={{ height: card.height }}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.img})` }}
            />

            {/* Dark gradient — fades in on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Name + role — slides up on hover */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-[10px] px-[18px] py-[16px] opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              <p className="font-bold text-[14px] leading-[1.2] tracking-[-0.025em] text-white">
                {card.name[locale]}
              </p>
              <p className="font-mono text-[10px] text-white/65 mt-[4px]">
                {card.role[locale]}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

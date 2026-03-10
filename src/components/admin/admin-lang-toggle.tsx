"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { ADMIN_LANG_COOKIE } from "@/lib/admin-lang-cookie";

type Props = {
  currentLang: "zh" | "en";
};

export function AdminLangToggle({ currentLang }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = currentLang === "zh" ? "en" : "zh";
    document.cookie = `${ADMIN_LANG_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-[#565E6C] hover:bg-[#F5F6FA] hover:text-[#4880FF] transition-colors disabled:opacity-40"
      aria-label="Switch admin language"
    >
      <span className="text-[14px]">{currentLang === "zh" ? "🇺🇸" : "🇨🇳"}</span>
      {isPending ? "…" : currentLang === "zh" ? "EN" : "中文"}
    </button>
  );
}

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
      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-sky-400 hover:text-sky-700 disabled:opacity-50"
      aria-label="Switch admin language"
    >
      {isPending ? "…" : currentLang === "zh" ? "EN" : "中文"}
    </button>
  );
}

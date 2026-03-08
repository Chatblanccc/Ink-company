"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { type AdminLocale } from "@/lib/admin-i18n";

type Props = {
  locale: AdminLocale;
  t: { savingBtn: string; savedBtn: string; saveBtn: string };
};

export function CmsSaveButton({ t }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const titleZh = (document.getElementById("title-zh") as HTMLInputElement)?.value ?? "";
    const titleEn = (document.getElementById("title-en") as HTMLInputElement)?.value ?? "";
    const descZh = (document.getElementById("description-zh") as HTMLTextAreaElement)?.value ?? "";
    const descEn = (document.getElementById("description-en") as HTMLTextAreaElement)?.value ?? "";

    setSaving(true);
    try {
      await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultSeoTitle: { zh: titleZh, en: titleEn },
          defaultSeoDescription: { zh: descZh, en: descEn },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
      {saving ? t.savingBtn : saved ? t.savedBtn : t.saveBtn}
    </Button>
  );
}

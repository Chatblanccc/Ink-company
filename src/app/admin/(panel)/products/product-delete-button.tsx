"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  locale: "zh" | "en";
};

export function ProductDeleteButton({ id, locale }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const isZh = locale === "zh";

  async function handleDelete() {
    const confirmed = window.confirm(
      isZh
        ? "确认删除这个产品？此操作不可撤销。"
        : "Delete this product? This action cannot be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      alert(isZh ? "删除失败，请重试。" : "Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      {deleting ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
      {isZh ? "删除" : "Delete"}
    </Button>
  );
}

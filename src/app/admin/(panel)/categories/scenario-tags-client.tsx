"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tag = { value: string; zh: string; en: string };
type Props = { initialTags: Tag[]; isZh: boolean };

export function ScenarioTagsClient({ initialTags, isZh }: Props) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateTag(idx: number, field: keyof Tag, value: string) {
    setTags((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
    setSaved(false);
  }

  function addTag() {
    setTags((prev) => [...prev, { value: "", zh: "", en: "" }]);
    setSaved(false);
  }

  function removeTag(idx: number) {
    setTags((prev) => prev.filter((_, i) => i !== idx));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/scenario-tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Error");
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-400">
        {isZh
          ? "这些标签会出现在产品编辑表单中，供打标用。Value 字段仅含小写字母和连字符。"
          : "These tags appear in the product edit form for tagging. Value field uses lowercase letters and hyphens only."}
      </p>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="grid grid-cols-[28px_1fr_1fr_1fr_32px] gap-2 px-4 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <span />
          <span>Value (key)</span>
          <span>中文标签</span>
          <span>English label</span>
          <span />
        </div>

        {tags.map((tag, idx) => (
          <div key={idx} className="grid grid-cols-[28px_1fr_1fr_1fr_32px] gap-2 items-center px-4 py-2">
            <GripVertical className="size-4 text-slate-300" />
            <Input
              value={tag.value}
              onChange={(e) =>
                updateTag(idx, "value", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
              }
              placeholder="packaging"
              className="h-8 font-mono text-xs"
            />
            <Input
              value={tag.zh}
              onChange={(e) => updateTag(idx, "zh", e.target.value)}
              placeholder="包装印刷"
              className="h-8 text-sm"
            />
            <Input
              value={tag.en}
              onChange={(e) => updateTag(idx, "en", e.target.value)}
              placeholder="Packaging"
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              variant="ghost"
              className="size-8 p-0 text-slate-400 hover:bg-red-50 hover:text-red-500"
              onClick={() => removeTag(idx)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-1.5 text-slate-600" onClick={addTag}>
          <Plus className="size-3.5" />
          {isZh ? "添加标签" : "Add tag"}
        </Button>
        <Button
          size="sm"
          className="bg-sky-600 text-white hover:bg-sky-700 gap-1.5 min-w-[80px]"
          onClick={save}
          disabled={saving}
        >
          {saving && <Loader2 className="size-3.5 animate-spin" />}
          {saved ? (isZh ? "已保存 ✓" : "Saved ✓") : (isZh ? "保存" : "Save")}
        </Button>
      </div>
    </div>
  );
}

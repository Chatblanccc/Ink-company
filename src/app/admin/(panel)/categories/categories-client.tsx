"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Category = { id: string; slug: string; name: Record<string, string>; sortOrder: number };
type Props = { categories: Category[]; isZh: boolean };

export function CategoriesClient({ categories: initial, isZh }: Props) {
  const router = useRouter();
  const [cats, setCats] = useState(initial);
  const [editId, setEditId] = useState<string | null>(null);
  const [editZh, setEditZh] = useState("");
  const [editEn, setEditEn] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New category form
  const [showNew, setShowNew] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newZh, setNewZh] = useState("");
  const [newEn, setNewEn] = useState("");
  const [creating, setCreating] = useState(false);

  /* ── Edit ─────────────────────────────────────────────────────────── */
  function startEdit(cat: Category) {
    setEditId(cat.id);
    setEditZh((cat.name.zh as string) ?? "");
    setEditEn((cat.name.en as string) ?? "");
    setError(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameZh: editZh, nameEn: editEn }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Error");
      setCats((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, name: { zh: editZh, en: editEn } } : c,
        ),
      );
      setEditId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  /* ── Delete ───────────────────────────────────────────────────────── */
  async function deleteCat(id: string) {
    if (!confirm(isZh ? "确认删除该分类？" : "Delete this category?")) return;
    setDeleting(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Error");
      setCats((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setDeleting(null);
    }
  }

  /* ── Create ───────────────────────────────────────────────────────── */
  async function createCat() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: newSlug, nameZh: newZh, nameEn: newEn }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Error");
      const { category } = await res.json();
      setCats((prev) => [...prev, category]);
      setNewSlug(""); setNewZh(""); setNewEn("");
      setShowNew(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* List */}
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {cats.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-slate-400">
            {isZh ? "暂无分类" : "No categories yet"}
          </p>
        )}
        {cats.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 px-5 py-3">
            <div className="flex-1 min-w-0">
              {editId === cat.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editZh}
                    onChange={(e) => setEditZh(e.target.value)}
                    placeholder="中文名称"
                    className="h-8 w-36 text-sm"
                  />
                  <Input
                    value={editEn}
                    onChange={(e) => setEditEn(e.target.value)}
                    placeholder="English name"
                    className="h-8 w-40 text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-slate-900">
                    {isZh ? (cat.name.zh ?? cat.name.en) : (cat.name.en ?? cat.name.zh)}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400">
                    {isZh ? (cat.name.en ?? "") : (cat.name.zh ?? "")}
                  </span>
                </div>
              )}
            </div>
            <Badge variant="outline" className="font-mono text-xs text-slate-500 shrink-0">
              {cat.slug}
            </Badge>
            <div className="flex items-center gap-1 shrink-0">
              {editId === cat.id ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-8 p-0 text-emerald-600 hover:bg-emerald-50"
                    disabled={saving}
                    onClick={() => saveEdit(cat.id)}
                  >
                    {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-8 p-0 text-slate-400 hover:bg-slate-100"
                    onClick={() => setEditId(null)}
                  >
                    <X className="size-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-8 p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    onClick={() => startEdit(cat)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-8 p-0 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    disabled={deleting === cat.id}
                    onClick={() => deleteCat(cat.id)}
                  >
                    {deleting === cat.id
                      ? <Loader2 className="size-3.5 animate-spin" />
                      : <Trash2 className="size-3.5" />}
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add new */}
      {showNew ? (
        <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            {isZh ? "新建分类" : "New category"}
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Slug</label>
              <Input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="e.g. water-based"
                className="h-8 font-mono text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">中文名称</label>
              <Input value={newZh} onChange={(e) => setNewZh(e.target.value)} placeholder="水性油墨" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">English name</label>
              <Input value={newEn} onChange={(e) => setNewEn(e.target.value)} placeholder="Water-based inks" className="h-8 text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-sky-600 text-white hover:bg-sky-700 gap-1.5"
              disabled={creating || !newSlug || !newZh || !newEn}
              onClick={createCat}
            >
              {creating && <Loader2 className="size-3.5 animate-spin" />}
              {isZh ? "创建" : "Create"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowNew(false)}>
              {isZh ? "取消" : "Cancel"}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-slate-600"
          onClick={() => { setShowNew(true); setError(null); }}
        >
          <Plus className="size-3.5" />
          {isZh ? "新建分类" : "New category"}
        </Button>
      )}
    </div>
  );
}

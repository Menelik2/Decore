"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Pencil, Trash2, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { designStore, type AdminDesign } from "@/lib/admin-store"
import { designs as seedDesigns, categories } from "@/lib/data/designs"
import { formatPrice, cn } from "@/lib/utils"

type FormState = {
  title: string
  description: string
  category: string
  categorySlug: string
  startingPrice: string
  imageUrl: string
  isFeatured: boolean
  isPublished: boolean
}

const emptyForm: FormState = {
  title: "",
  description: "",
  category: "Weddings",
  categorySlug: "weddings",
  startingPrice: "",
  imageUrl: "",
  isFeatured: false,
  isPublished: true,
}

export default function AdminDesignsPage() {
  const [items, setItems] = useState<AdminDesign[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const refresh = () => {
    let list = designStore.list()
    if (list.length === 0) {
      for (const d of seedDesigns.slice(0, 12)) {
        designStore.create({
          title: d.title,
          description: d.description,
          category: d.category,
          categorySlug: d.categorySlug,
          startingPrice: d.startingPrice,
          isFeatured: d.isFeatured,
          isPublished: true,
          images: d.images.map((i) => ({ url: i.url, alt: i.alt })),
          slug: d.slug,
        })
      }
      list = designStore.list()
    }
    setItems(list)
  }

  useEffect(() => {
    refresh()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (d: AdminDesign) => {
    setEditingId(d.id)
    setForm({
      title: d.title,
      description: d.description,
      category: d.category,
      categorySlug: d.categorySlug,
      startingPrice: String(d.startingPrice),
      imageUrl: d.images[0]?.url || "",
      isFeatured: d.isFeatured,
      isPublished: d.isPublished,
    })
    setFormOpen(true)
  }

  const save = () => {
    if (!form.title.trim()) return
    const images = form.imageUrl.trim()
      ? [{ url: form.imageUrl.trim(), alt: form.title }]
      : [
          {
            url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
            alt: form.title,
          },
        ]
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      categorySlug: form.categorySlug,
      startingPrice: Number(form.startingPrice) || 0,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      images,
    }
    if (editingId) designStore.update(editingId, payload)
    else designStore.create(payload)
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    refresh()
  }

  const remove = (id: string) => {
    if (!confirm("Delete this design?")) return
    designStore.remove(id)
    refresh()
  }

  const filtered = items.filter((d) => {
    if (category !== "all" && d.categorySlug !== category) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-label">
            Designs
          </h1>
          <p className="text-[13px] text-label-secondary mt-1">
            {items.length} designs · full CRUD
          </p>
        </div>
        <Button onClick={openCreate} className="h-11 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-label-secondary" />
        <Input
          placeholder="Search designs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 text-[16px] rounded-xl bg-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold min-h-[40px] border",
            category === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-label border-black/[0.08]"
          )}
        >
          All
        </button>
        {categories
          .filter((c) => c.slug !== "all")
          .map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold min-h-[40px] border",
                category === c.slug
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-label border-black/[0.08]"
              )}
            >
              {c.name}
            </button>
          ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.04] bg-white p-10 text-center">
          <ImageIcon className="h-10 w-10 mx-auto text-label-tertiary mb-3" />
          <p className="text-sm text-label-secondary mb-4">No designs yet</p>
          <Button onClick={openCreate}>Add design</Button>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((d) => (
            <li
              key={d.id}
              className="rounded-2xl border border-black/[0.04] bg-white p-3.5 flex gap-3 items-center"
            >
              <div
                className="h-14 w-14 rounded-xl bg-muted bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${d.images[0]?.url || ""})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] text-label truncate">{d.title}</p>
                <p className="text-[13px] text-label-secondary">
                  {formatPrice(d.startingPrice)} · {d.category}
                </p>
                {!d.isPublished && (
                  <span className="text-[10px] font-semibold uppercase text-amber-700">Draft</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => openEdit(d)}
                className="h-11 w-11 flex items-center justify-center rounded-full active:bg-fill-secondary"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(d.id)}
                className="h-11 w-11 flex items-center justify-center rounded-full text-red-600 active:bg-red-50"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {formOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setFormOpen(false)} />
          <div
            className="fixed left-0 right-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-[20px] bg-white shadow-2xl"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="sticky top-0 bg-white border-b border-black/[0.06] px-4 py-3 flex items-center justify-between">
              <p className="text-[17px] font-semibold">
                {editingId ? "Edit design" : "New design"}
              </p>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="h-9 w-9 rounded-full bg-fill-secondary flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="h-12 text-[16px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="text-[16px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Starting price</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={form.startingPrice}
                    onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
                    className="h-12 text-[16px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <select
                    value={form.categorySlug}
                    onChange={(e) => {
                      const cat = categories.find((c) => c.slug === e.target.value)
                      setForm({
                        ...form,
                        categorySlug: e.target.value,
                        category: cat?.name || e.target.value,
                      })
                    }}
                    className="w-full h-12 rounded-xl border border-input bg-white px-3 text-[16px]"
                  >
                    {categories
                      .filter((c) => c.slug !== "all")
                      .map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="h-12 text-[16px]"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[14px] min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="h-5 w-5"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-[14px] min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="h-5 w-5"
                  />
                  Published
                </label>
              </div>
              <Button onClick={save} className="w-full h-12" disabled={!form.title.trim()}>
                {editingId ? "Save changes" : "Create design"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

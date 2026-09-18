"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Pencil, Trash2, X, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { productStore, type AdminProduct } from "@/lib/admin-store"
import { products as seedProducts, productCategories } from "@/lib/data/products"
import { formatPrice, cn } from "@/lib/utils"

type FormState = {
  name: string
  description: string
  price: string
  category: string
  image: string
  stock: string
  isFeatured: boolean
  isPublished: boolean
}

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  category: "Bouquets",
  image: "",
  stock: "10",
  isFeatured: false,
  isPublished: true,
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<AdminProduct[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const refresh = () => {
    let list = productStore.list()
    if (list.length === 0) {
      for (const p of seedProducts) {
        productStore.create({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          image: p.image,
          stock: 25,
          isFeatured: !!p.isFeatured,
          isPublished: true,
          slug: p.slug,
        })
      }
      list = productStore.list()
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

  const openEdit = (p: AdminProduct) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      image: p.image,
      stock: String(p.stock),
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
    })
    setFormOpen(true)
  }

  const save = () => {
    if (!form.name.trim()) return
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      category: form.category,
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
      stock: Number(form.stock) || 0,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
    }
    if (editingId) productStore.update(editingId, payload)
    else productStore.create(payload)
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    refresh()
  }

  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return
    productStore.remove(id)
    refresh()
  }

  const filtered = items.filter((p) => {
    if (category !== "All" && p.category !== category) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    }
    return true
  })

  const cats = [
    "All",
    ...Array.from(
      new Set([
        ...productCategories.filter((c) => c !== "All"),
        ...items.map((i) => i.category),
      ])
    ),
  ]

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-label">
            Products
          </h1>
          <p className="text-[13px] text-label-secondary mt-1">
            {items.length} products · full CRUD
          </p>
        </div>
        <Button onClick={openCreate} className="h-11 shrink-0 touch-manipulation">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-label-secondary" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 text-[16px] rounded-xl bg-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold min-h-[40px] border touch-manipulation",
              category === c
                ? "bg-primary text-white border-primary"
                : "bg-white text-label border-black/[0.08]"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.04] bg-white p-10 text-center">
          <Package className="h-10 w-10 mx-auto text-label-tertiary mb-3" />
          <p className="text-sm text-label-secondary mb-4">No products yet</p>
          <Button onClick={openCreate}>Add product</Button>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="rounded-2xl border border-black/[0.04] bg-white p-3.5 flex gap-3 items-center"
            >
              <div
                className="h-14 w-14 rounded-xl bg-muted bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${p.image})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] text-label truncate">{p.name}</p>
                <p className="text-[13px] text-label-secondary">
                  {formatPrice(p.price)} · {p.category} · stock {p.stock}
                </p>
                {!p.isPublished && (
                  <span className="text-[10px] font-semibold uppercase text-amber-700">Draft</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => openEdit(p)}
                className="h-11 w-11 flex items-center justify-center rounded-full active:bg-fill-secondary touch-manipulation"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4 text-label" />
              </button>
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="h-11 w-11 flex items-center justify-center rounded-full text-red-600 active:bg-red-50 touch-manipulation"
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
              <p className="text-[17px] font-semibold text-label">
                {editingId ? "Edit product" : "New product"}
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
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-12 text-[16px]"
                  placeholder="Product name"
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
                  <Label>Price (ETB)</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="h-12 text-[16px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="h-12 text-[16px]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-12 rounded-xl border border-input bg-white px-3 text-[16px]"
                >
                  {productCategories
                    .filter((c) => c !== "All")
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <Input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="h-12 text-[16px]"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-4 pt-1">
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
              <Button onClick={save} className="w-full h-12" disabled={!form.name.trim()}>
                {editingId ? "Save changes" : "Create product"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

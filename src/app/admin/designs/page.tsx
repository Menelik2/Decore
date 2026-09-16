"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ExternalLink, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader, type UploadedImage } from "@/components/shared/image-uploader"
import { designs, categories } from "@/lib/data/designs"
import { UPLOAD_BUCKETS } from "@/lib/upload"
import { formatPrice, cn } from "@/lib/utils"

export default function AdminDesignsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [showUpload, setShowUpload] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [desc, setDesc] = useState("")
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const filtered = designs.filter((d) => {
    if (category !== "all" && d.categorySlug !== category) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        d.title.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleSaveDraft = () => {
    if (!title.trim()) {
      setSavedMsg("Please enter a title.")
      return
    }
    if (!images.length) {
      setSavedMsg("Please upload at least one image.")
      return
    }
    // Persist draft metadata locally until Supabase designs table is wired
    try {
      const drafts = JSON.parse(localStorage.getItem("decore-design-drafts") || "[]")
      drafts.unshift({
        id: `draft-${Date.now()}`,
        title,
        startingPrice: Number(price) || 0,
        description: desc,
        images: images.map((i) => ({ url: i.url, path: i.path, alt: title })),
        created_at: new Date().toISOString(),
      })
      localStorage.setItem("decore-design-drafts", JSON.stringify(drafts))
      setSavedMsg(`Saved draft with ${images.length} image(s). Connect Supabase to publish live.`)
      setTitle("")
      setPrice("")
      setDesc("")
      setImages([])
      setShowUpload(false)
    } catch {
      setSavedMsg("Could not save draft.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-deep-burgundy">
            Designs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gallery designs · upload new images to cloud storage
          </p>
        </div>
        <Button
          onClick={() => {
            setShowUpload(!showUpload)
            setSavedMsg(null)
          }}
          className="gap-1.5"
        >
          {showUpload ? (
            <>
              <X className="h-4 w-4" /> Close
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add design
            </>
          )}
        </Button>
      </div>

      {showUpload && (
        <div className="rounded-2xl border border-border bg-white p-6 mb-8 space-y-5">
          <h2 className="font-medium text-foreground">New design with images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. White & Gold Wedding"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Starting price (ETB)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Materials, style, occasion..."
            />
          </div>

          <ImageUploader
            bucket={UPLOAD_BUCKETS.gallery}
            folder="designs"
            value={images}
            onChange={setImages}
            maxFiles={10}
            label="Design photos *"
            hint="Upload high-quality photos · JPEG/PNG/WebP · max 5 MB"
          />

          <div className="flex flex-wrap gap-3 items-center">
            <Button onClick={handleSaveDraft}>Save draft</Button>
            {savedMsg && (
              <p className="text-sm text-muted-foreground">{savedMsg}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search designs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-xl border border-input bg-white px-4 text-sm"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Design</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Flags</th>
                <th className="px-4 py-3 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={d.images[0]?.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{d.title}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {d.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                    {d.category}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(d.startingPrice)}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {d.isFeatured && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-deep-burgundy/10 text-deep-burgundy font-medium">
                          Featured
                        </span>
                      )}
                      {d.isTrending && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/20 text-amber-800 font-medium">
                          Trending
                        </span>
                      )}
                      {d.isNew && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/designs/${d.slug}`}
                      target="_blank"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

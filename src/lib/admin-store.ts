/**
 * Local-first admin CRUD store.
 * Persists to localStorage until Supabase tables are connected.
 */

export type AdminProduct = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  isFeatured: boolean
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type AdminDesign = {
  id: string
  title: string
  slug: string
  description: string
  category: string
  categorySlug: string
  startingPrice: number
  isFeatured: boolean
  isPublished: boolean
  images: { url: string; alt: string }[]
  createdAt: string
  updatedAt: string
}

export type AdminPromo = {
  id: string
  code: string
  discountPercent: number
  active: boolean
  createdAt: string
}

const KEYS = {
  products: "decore-admin-products",
  designs: "decore-admin-designs",
  promotions: "decore-promotions",
  orders: "decore-orders",
  bookings: "decore-bookings",
  reviews: "decore-reviews",
} as const

function read<T>(key: string, fallback: T[] = []): T[] {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(items))
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

function id(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export const productStore = {
  list(): AdminProduct[] {
    return read<AdminProduct>(KEYS.products)
  },
  get(id: string) {
    return this.list().find((p) => p.id === id) || null
  },
  create(
    input: Omit<AdminProduct, "id" | "slug" | "createdAt" | "updatedAt"> & {
      slug?: string
    }
  ): AdminProduct {
    const now = new Date().toISOString()
    const item: AdminProduct = {
      ...input,
      id: id("prod"),
      slug: input.slug || slugify(input.name),
      createdAt: now,
      updatedAt: now,
    }
    write(KEYS.products, [item, ...this.list()])
    return item
  },
  update(
    productId: string,
    patch: Partial<Omit<AdminProduct, "id" | "createdAt">>
  ): AdminProduct | null {
    const list = this.list()
    const idx = list.findIndex((p) => p.id === productId)
    if (idx < 0) return null
    const updated: AdminProduct = {
      ...list[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    if (patch.name && !patch.slug) updated.slug = slugify(patch.name)
    list[idx] = updated
    write(KEYS.products, list)
    return updated
  },
  remove(productId: string): boolean {
    const list = this.list()
    const next = list.filter((p) => p.id !== productId)
    if (next.length === list.length) return false
    write(KEYS.products, next)
    return true
  },
}

export const designStore = {
  list(): AdminDesign[] {
    return read<AdminDesign>(KEYS.designs)
  },
  get(designId: string) {
    return this.list().find((d) => d.id === designId) || null
  },
  create(
    input: Omit<AdminDesign, "id" | "slug" | "createdAt" | "updatedAt"> & {
      slug?: string
    }
  ): AdminDesign {
    const now = new Date().toISOString()
    const item: AdminDesign = {
      ...input,
      id: id("des"),
      slug: input.slug || slugify(input.title),
      createdAt: now,
      updatedAt: now,
    }
    write(KEYS.designs, [item, ...this.list()])
    return item
  },
  update(
    designId: string,
    patch: Partial<Omit<AdminDesign, "id" | "createdAt">>
  ): AdminDesign | null {
    const list = this.list()
    const idx = list.findIndex((d) => d.id === designId)
    if (idx < 0) return null
    const updated: AdminDesign = {
      ...list[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    if (patch.title && !patch.slug) updated.slug = slugify(patch.title)
    list[idx] = updated
    write(KEYS.designs, list)
    return updated
  },
  remove(designId: string): boolean {
    const list = this.list()
    const next = list.filter((d) => d.id !== designId)
    if (next.length === list.length) return false
    write(KEYS.designs, next)
    return true
  },
}

export const orderStore = {
  list<T = Record<string, unknown>>(): T[] {
    return read<T>(KEYS.orders)
  },
  save<T>(items: T[]) {
    write(KEYS.orders, items)
  },
  remove(orderNumber: string): boolean {
    const list = this.list<{ order_number: string }>()
    const next = list.filter((o) => o.order_number !== orderNumber)
    if (next.length === list.length) return false
    write(KEYS.orders, next)
    return true
  },
}

export const bookingStore = {
  list<T = Record<string, unknown>>(): T[] {
    return read<T>(KEYS.bookings)
  },
  save<T>(items: T[]) {
    write(KEYS.bookings, items)
  },
  remove(bookingId: string): boolean {
    const list = this.list<{ id: string }>()
    const next = list.filter((b) => b.id !== bookingId)
    if (next.length === list.length) return false
    write(KEYS.bookings, next)
    return true
  },
}

export const promoStore = {
  list(): AdminPromo[] {
    return read<AdminPromo>(KEYS.promotions)
  },
  create(code: string, discountPercent: number): AdminPromo {
    const item: AdminPromo = {
      id: id("promo"),
      code: code.trim().toUpperCase(),
      discountPercent,
      active: true,
      createdAt: new Date().toISOString(),
    }
    write(KEYS.promotions, [item, ...this.list()])
    return item
  },
  update(promoId: string, patch: Partial<AdminPromo>): AdminPromo | null {
    const list = this.list()
    const idx = list.findIndex((p) => p.id === promoId)
    if (idx < 0) return null
    list[idx] = { ...list[idx], ...patch }
    write(KEYS.promotions, list)
    return list[idx]
  },
  remove(promoId: string): boolean {
    const list = this.list()
    const next = list.filter((p) => p.id !== promoId)
    if (next.length === list.length) return false
    write(KEYS.promotions, next)
    return true
  },
}

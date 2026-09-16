export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN" | "SUPER_ADMIN"

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED"

export type EventType =
  | "WEDDING"
  | "BIRTHDAY"
  | "GRADUATION"
  | "ENGAGEMENT"
  | "ANNIVERSARY"
  | "BABY_SHOWER"
  | "CORPORATE"
  | "ETHIOPIAN_TRADITIONAL"
  | "OTHER"

export type FlowerType =
  | "ROSE"
  | "LILY"
  | "SUNFLOWER"
  | "ORCHID"
  | "TULIP"
  | "MIXED"
  | "ETHIOPIAN_LOCAL"

export type DecorationStyle =
  | "CLASSIC"
  | "MODERN"
  | "LUXURY"
  | "MINIMAL"
  | "ETHIOPIAN_TRADITIONAL"

export type Size = "SMALL" | "MEDIUM" | "LARGE" | "PREMIUM"

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  email: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  category_id: string | null
  is_featured: boolean
  is_published: boolean
  stock: number
  created_at: string
  updated_at: string
  images?: ProductImage[]
  category?: Category
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt: string | null
  sort_order: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
}

export interface GalleryDesign {
  id: string
  title: string
  slug: string
  description: string | null
  category_id: string | null
  occasion: EventType | null
  starting_price: number
  is_featured: boolean
  is_trending: boolean
  is_new: boolean
  materials: string[] | null
  flower_types: string[] | null
  color_palette: string[] | null
  size: string | null
  created_at: string
  images?: GalleryImage[]
  category?: Category
}

export interface GalleryImage {
  id: string
  design_id: string
  url: string
  alt: string | null
  is_before: boolean
  sort_order: number
}

export interface Order {
  id: string
  user_id: string | null
  order_number: string
  status: OrderStatus
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_address: string
  city: string
  preferred_date: string | null
  preferred_time: string | null
  notes: string | null
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  payment_method: string | null
  payment_status: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  design_id: string | null
  name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface EventBooking {
  id: string
  user_id: string | null
  event_type: EventType
  event_date: string
  event_time: string | null
  venue: string
  guest_count: number
  decoration_style: DecorationStyle | null
  color_theme: string | null
  budget: number | null
  special_instructions: string | null
  estimated_cost: number | null
  status: string
  created_at: string
  services?: string[]
}

export interface CustomDesign {
  id: string
  user_id: string | null
  occasion: EventType
  flower_type: FlowerType
  colors: string[]
  size: Size
  style: DecorationStyle
  addons: string[]
  message: string | null
  estimated_price: number
  status: string
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  design_id: string | null
  product_id: string | null
  rating: number
  comment: string | null
  event_type: string | null
  is_approved: boolean
  created_at: string
  profile?: Profile
}

export interface Address {
  id: string
  user_id: string
  label: string
  address_line: string
  city: string
  is_default: boolean
}

export interface CartItem {
  id: string
  product_id?: string
  design_id?: string
  name: string
  price: number
  quantity: number
  image?: string
  slug?: string
}

export const ETHIOPIAN_CITIES = [
  "Addis Ababa",
  "Bahir Dar",
  "Gondar",
  "Hawassa",
  "Mekelle",
  "Dire Dawa",
  "Adama",
  "Jimma",
  "Dessie",
  "Other",
] as const

export const CATEGORIES = [
  { name: "Flowers", slug: "flowers", icon: "🌹" },
  { name: "Bouquets", slug: "bouquets", icon: "💐" },
  { name: "Weddings", slug: "weddings", icon: "💍" },
  { name: "Birthdays", slug: "birthdays", icon: "🎂" },
  { name: "Graduation", slug: "graduation", icon: "🎓" },
  { name: "Engagement", slug: "engagement", icon: "❤️" },
  { name: "Baby Shower", slug: "baby-shower", icon: "👶" },
  { name: "Corporate", slug: "corporate", icon: "🏢" },
  { name: "Ethiopian Traditional", slug: "ethiopian-traditional", icon: "🇪🇹" },
  { name: "Events", slug: "events", icon: "🎉" },
  { name: "Home Decor", slug: "home-decor", icon: "🌸" },
] as const

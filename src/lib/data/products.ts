export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  image: string
  isFeatured?: boolean
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Classic Red Rose Bouquet",
    slug: "classic-red-rose-bouquet",
    description: "Twelve premium long-stem red roses with soft greenery and satin ribbon. Perfect for romance and anniversaries.",
    price: 3200,
    category: "Bouquets",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    isFeatured: true,
  },
  {
    id: "p2",
    name: "Blush Peony Arrangement",
    slug: "blush-peony-arrangement",
    description: "Soft blush peonies mixed with white roses in an elegant vase arrangement for home or gifting.",
    price: 4800,
    category: "Arrangements",
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80",
    isFeatured: true,
  },
  {
    id: "p3",
    name: "Sunflower Bright Bundle",
    slug: "sunflower-bright-bundle",
    description: "Cheerful sunflowers with seasonal fillers. Brings sunshine to any room.",
    price: 2500,
    category: "Bouquets",
    image: "https://images.unsplash.com/photo-1597848212624-e430e4e0ab1d?w=800&q=80",
  },
  {
    id: "p4",
    name: "White Lily Elegance",
    slug: "white-lily-elegance",
    description: "Fragrant white lilies in a minimal modern presentation. Ideal for sympathy or refined gifts.",
    price: 3800,
    category: "Bouquets",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  },
  {
    id: "p5",
    name: "Mixed Seasonal Blooms",
    slug: "mixed-seasonal-blooms",
    description: "Hand-selected seasonal flowers in a vibrant mixed bouquet. Changes with the season.",
    price: 2900,
    category: "Bouquets",
    image: "https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=800&q=80",
    isFeatured: true,
  },
  {
    id: "p6",
    name: "Orchid Luxury Pot",
    slug: "orchid-luxury-pot",
    description: "Elegant potted orchid for lasting beauty. A sophisticated gift or home accent.",
    price: 5500,
    category: "Potted",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    id: "p7",
    name: "Romantic Pink Rose Box",
    slug: "romantic-pink-rose-box",
    description: "Pink roses arranged in a premium gift box. Ready to present with optional chocolate add-on.",
    price: 4200,
    category: "Gift Boxes",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
  },
  {
    id: "p8",
    name: "Ethiopian Wildflower Mix",
    slug: "ethiopian-wildflower-mix",
    description: "Locally sourced seasonal wildflowers celebrating Ethiopian natural beauty.",
    price: 2200,
    category: "Local",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    isFeatured: true,
  },
]

export const productCategories = [
  "All",
  "Bouquets",
  "Arrangements",
  "Gift Boxes",
  "Potted",
  "Local",
]

export interface Design {
  id: string
  title: string
  slug: string
  description: string
  category: string
  categorySlug: string
  occasion: string
  startingPrice: number
  isFeatured: boolean
  isTrending: boolean
  isNew: boolean
  materials: string[]
  flowerTypes: string[]
  colorPalette: string[]
  size: string
  images: { url: string; alt: string; isBefore?: boolean }[]
  tags: string[]
}

export const designs: Design[] = [
  {
    id: "1",
    title: "White & Gold Wedding Elegance",
    slug: "white-gold-wedding",
    description:
      "A breathtaking wedding design featuring cascading white roses, soft peonies, and delicate gold accents. Perfect for luxury ceremonies and receptions. Includes bridal table, entrance arch, and guest table arrangements.",
    category: "Weddings",
    categorySlug: "weddings",
    occasion: "WEDDING",
    startingPrice: 45000,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    materials: ["White Roses", "Peonies", "Eucalyptus", "Gold Leaf Accents", "Crystal Vases"],
    flowerTypes: ["Rose", "Peony", "Eucalyptus"],
    colorPalette: ["#FFFFFF", "#F5E6C8", "#C9A86C", "#E8DFD8"],
    size: "Full Venue",
    images: [
      { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80", alt: "White and gold wedding setup" },
      { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80", alt: "Wedding table decoration" },
      { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80", alt: "Bridal arrangement" },
    ],
    tags: ["wedding", "luxury", "white", "gold", "elegant"],
  },
  {
    id: "2",
    title: "Romantic Rose Bouquet",
    slug: "romantic-rose-bouquet",
    description:
      "Hand-tied bouquet of premium long-stem red and blush roses with soft greenery. Ideal for proposals, anniversaries, or as a heartfelt gift. Delivered in an elegant gift box with optional greeting card.",
    category: "Bouquets",
    categorySlug: "bouquets",
    occasion: "GIFT",
    startingPrice: 3500,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    materials: ["Premium Roses", "Ruscus", "Satin Ribbon"],
    flowerTypes: ["Rose"],
    colorPalette: ["#8B2942", "#D4A5A5", "#F5E6E8", "#FFFFFF"],
    size: "Medium",
    images: [
      { url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80", alt: "Romantic rose bouquet" },
      { url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80", alt: "Rose close-up" },
    ],
    tags: ["bouquet", "roses", "romantic", "gift", "red"],
  },
  {
    id: "3",
    title: "Traditional Habesha Ceremony",
    slug: "habesha-ceremony",
    description:
      "Authentic Ethiopian traditional ceremony decoration featuring vibrant local flowers, cultural textiles, and elegant stage design. Designed for Timket, weddings, and cultural celebrations with deep respect for heritage.",
    category: "Ethiopian Traditional",
    categorySlug: "ethiopian-traditional",
    occasion: "ETHIOPIAN_TRADITIONAL",
    startingPrice: 65000,
    isFeatured: true,
    isTrending: false,
    isNew: true,
    materials: ["Local Ethiopian Flowers", "Traditional Fabrics", "Woven Baskets", "Greenery"],
    flowerTypes: ["Ethiopian Local", "Mixed"],
    colorPalette: ["#C9A86C", "#8B2942", "#A8B5A0", "#FDFBF7"],
    size: "Full Venue",
    images: [
      { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80", alt: "Traditional ceremony decoration" },
      { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80", alt: "Cultural floral arrangement" },
    ],
    tags: ["ethiopian", "traditional", "habesha", "cultural", "ceremony"],
  },
  {
    id: "4",
    title: "Birthday Celebration Blooms",
    slug: "birthday-celebration",
    description:
      "Joyful and colorful birthday decoration package with balloon accents, table centerpieces, and a statement flower wall. Customizable color themes for any age.",
    category: "Birthdays",
    categorySlug: "birthdays",
    occasion: "BIRTHDAY",
    startingPrice: 12000,
    isFeatured: false,
    isTrending: true,
    isNew: false,
    materials: ["Mixed Seasonal Flowers", "Balloons", "Greenery", "Ribbons"],
    flowerTypes: ["Mixed", "Sunflower", "Rose"],
    colorPalette: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"],
    size: "Medium Venue",
    images: [
      { url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80", alt: "Birthday celebration setup" },
      { url: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&q=80", alt: "Colorful birthday flowers" },
    ],
    tags: ["birthday", "colorful", "celebration", "party"],
  },
  {
    id: "5",
    title: "Elegant Bridal Bouquet",
    slug: "elegant-bridal-bouquet",
    description:
      "Classic cascading bridal bouquet with white roses, ranunculus, and soft foliage. Designed to complement any wedding dress and theme. Matching boutonnières available.",
    category: "Weddings",
    categorySlug: "weddings",
    occasion: "WEDDING",
    startingPrice: 5500,
    isFeatured: true,
    isTrending: false,
    isNew: true,
    materials: ["White Roses", "Ranunculus", "Ivy", "Pearl Pins"],
    flowerTypes: ["Rose", "Ranunculus"],
    colorPalette: ["#FFFFFF", "#F8F4F0", "#E8DFD8"],
    size: "Bridal",
    images: [
      { url: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1200&q=80", alt: "Elegant bridal bouquet" },
      { url: "https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=1200&q=80", alt: "Bridal flowers detail" },
    ],
    tags: ["bridal", "bouquet", "wedding", "white", "elegant"],
  },
  {
    id: "6",
    title: "Corporate Event Floral",
    slug: "corporate-event-floral",
    description:
      "Sophisticated and refined floral designs for corporate events, product launches, and conferences. Clean lines, premium blooms, and professional presentation.",
    category: "Corporate",
    categorySlug: "corporate",
    occasion: "CORPORATE",
    startingPrice: 28000,
    isFeatured: false,
    isTrending: false,
    isNew: false,
    materials: ["Orchids", "Anthuriums", "Monstera", "Modern Vases"],
    flowerTypes: ["Orchid", "Mixed"],
    colorPalette: ["#1A1A1A", "#FFFFFF", "#A8B5A0", "#C9A86C"],
    size: "Large Venue",
    images: [
      { url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80", alt: "Corporate floral arrangement" },
      { url: "https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=1200&q=80", alt: "Modern corporate flowers" },
    ],
    tags: ["corporate", "professional", "modern", "event"],
  },
  {
    id: "7",
    title: "Graduation Glory",
    slug: "graduation-glory",
    description:
      "Celebrate academic achievement with vibrant mixed bouquets and stage decorations. Available in school colors or classic graduation themes.",
    category: "Graduation",
    categorySlug: "graduation",
    occasion: "GRADUATION",
    startingPrice: 4500,
    isFeatured: false,
    isTrending: true,
    isNew: true,
    materials: ["Gerbera", "Roses", "Lilies", "Greenery"],
    flowerTypes: ["Rose", "Lily", "Mixed"],
    colorPalette: ["#4D96FF", "#FFD93D", "#FFFFFF", "#6BCB77"],
    size: "Medium",
    images: [
      { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80", alt: "Graduation flowers" },
      { url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80", alt: "Celebration bouquet" },
    ],
    tags: ["graduation", "celebration", "achievement", "gift"],
  },
  {
    id: "8",
    title: "Baby Shower Soft Pastels",
    slug: "baby-shower-pastels",
    description:
      "Gentle pastel arrangements perfect for baby showers. Soft pinks, blues, and creams with delicate blooms and optional gender-neutral options.",
    category: "Baby Shower",
    categorySlug: "baby-shower",
    occasion: "BABY_SHOWER",
    startingPrice: 9500,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    materials: ["Carnations", "Baby's Breath", "Roses", "Pastel Ribbons"],
    flowerTypes: ["Rose", "Mixed"],
    colorPalette: ["#FFB6C1", "#ADD8E6", "#FFF5EE", "#E6E6FA"],
    size: "Medium Venue",
    images: [
      { url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80", alt: "Baby shower flowers" },
      { url: "https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=1200&q=80", alt: "Pastel arrangement" },
    ],
    tags: ["baby shower", "pastel", "soft", "celebration"],
  },
  {
    id: "9",
    title: "Engagement Ring of Flowers",
    slug: "engagement-ring-flowers",
    description:
      "Romantic engagement setup featuring a floral ring, candlelight, and intimate table decoration. Perfect for proposal moments and engagement parties.",
    category: "Engagement",
    categorySlug: "engagement",
    occasion: "ENGAGEMENT",
    startingPrice: 18000,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    materials: ["Red Roses", "Candles", "Petals", "Fairy Lights"],
    flowerTypes: ["Rose"],
    colorPalette: ["#8B2942", "#FFFFFF", "#C9A86C", "#1A1A1A"],
    size: "Intimate",
    images: [
      { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80", alt: "Engagement floral setup" },
      { url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80", alt: "Romantic roses" },
    ],
    tags: ["engagement", "proposal", "romantic", "roses"],
  },
  {
    id: "10",
    title: "Luxury Orchid Arrangement",
    slug: "luxury-orchid-arrangement",
    description:
      "Striking modern orchid arrangement in a premium ceramic vase. Long-lasting and sophisticated — ideal as a luxury gift or home statement piece.",
    category: "Home Decor",
    categorySlug: "home-decor",
    occasion: "GIFT",
    startingPrice: 4200,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    materials: ["Phalaenopsis Orchids", "Ceramic Vase", "Moss"],
    flowerTypes: ["Orchid"],
    colorPalette: ["#FFFFFF", "#E8DFD8", "#1A1A1A"],
    size: "Large",
    images: [
      { url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80", alt: "Luxury orchid arrangement" },
      { url: "https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=1200&q=80", alt: "Orchid detail" },
    ],
    tags: ["orchid", "luxury", "home", "modern", "gift"],
  },
  {
    id: "11",
    title: "Sunflower Joy Bouquet",
    slug: "sunflower-joy-bouquet",
    description:
      "Bright and cheerful sunflower bouquet mixed with seasonal blooms. Brings sunshine into any room — perfect for birthdays, get-well, or just because.",
    category: "Bouquets",
    categorySlug: "bouquets",
    occasion: "GIFT",
    startingPrice: 2800,
    isFeatured: false,
    isTrending: true,
    isNew: false,
    materials: ["Sunflowers", "Seasonal Filler", "Kraft Paper"],
    flowerTypes: ["Sunflower", "Mixed"],
    colorPalette: ["#FFD93D", "#6BCB77", "#F5E6C8"],
    size: "Medium",
    images: [
      { url: "https://images.unsplash.com/photo-1597848212624-e430e4e0ab1d?w=1200&q=80", alt: "Sunflower bouquet" },
      { url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80", alt: "Bright flowers" },
    ],
    tags: ["sunflower", "cheerful", "bright", "gift"],
  },
  {
    id: "12",
    title: "Stage & Entrance Grandeur",
    slug: "stage-entrance-grandeur",
    description:
      "Dramatic stage backdrop and entrance floral installation for weddings and large events. Creates an unforgettable first impression with height, texture, and color.",
    category: "Events",
    categorySlug: "events",
    occasion: "WEDDING",
    startingPrice: 85000,
    isFeatured: true,
    isTrending: false,
    isNew: false,
    materials: ["Roses", "Hydrangeas", "Greenery Walls", "Lighting Accents"],
    flowerTypes: ["Rose", "Mixed"],
    colorPalette: ["#FFFFFF", "#8B2942", "#C9A86C", "#A8B5A0"],
    size: "Full Venue",
    images: [
      { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80", alt: "Grand stage decoration" },
      { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80", alt: "Entrance floral arch" },
    ],
    tags: ["stage", "entrance", "grand", "wedding", "event"],
  },
]

export const categories = [
  { name: "All", slug: "all", icon: "✨" },
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
]

export function getDesignBySlug(slug: string): Design | undefined {
  return designs.find((d) => d.slug === slug)
}

export function getRelatedDesigns(design: Design, limit = 3): Design[] {
  return designs
    .filter(
      (d) =>
        d.id !== design.id &&
        (d.categorySlug === design.categorySlug || d.occasion === design.occasion)
    )
    .slice(0, limit)
}

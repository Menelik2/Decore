-- Decore seed data: designs, products, images
-- Run AFTER schema.sql in Supabase SQL Editor
-- Safe to re-run: uses ON CONFLICT where possible

-- ========== PRODUCTS ==========
INSERT INTO products (name, slug, description, price, category_id, is_featured, is_published, stock)
SELECT v.name, v.slug, v.description, v.price, c.id, v.is_featured, true, v.stock
FROM (VALUES
  ('Classic Red Rose Bouquet', 'classic-red-rose-bouquet', 'Twelve premium long-stem red roses with soft greenery and satin ribbon. Perfect for romance and anniversaries.', 3200::numeric, 'bouquets', true, 50),
  ('Blush Peony Arrangement', 'blush-peony-arrangement', 'Soft blush peonies mixed with white roses in an elegant vase arrangement for home or gifting.', 4800::numeric, 'flowers', true, 30),
  ('Sunflower Bright Bundle', 'sunflower-bright-bundle', 'Cheerful sunflowers with seasonal fillers. Brings sunshine to any room.', 2500::numeric, 'bouquets', false, 40),
  ('White Lily Elegance', 'white-lily-elegance', 'Fragrant white lilies in a minimal modern presentation. Ideal for sympathy or refined gifts.', 3800::numeric, 'bouquets', false, 25),
  ('Mixed Seasonal Blooms', 'mixed-seasonal-blooms', 'Hand-selected seasonal flowers in a vibrant mixed bouquet. Changes with the season.', 2900::numeric, 'bouquets', true, 60),
  ('Orchid Luxury Pot', 'orchid-luxury-pot', 'Elegant potted orchid for lasting beauty. A sophisticated gift or home accent.', 5500::numeric, 'home-decor', false, 20),
  ('Romantic Pink Rose Box', 'romantic-pink-rose-box', 'Pink roses arranged in a premium gift box. Ready to present with optional chocolate add-on.', 4200::numeric, 'bouquets', false, 35),
  ('Ethiopian Wildflower Mix', 'ethiopian-wildflower-mix', 'Locally sourced seasonal wildflowers celebrating Ethiopian natural beauty.', 2200::numeric, 'flowers', true, 45)
) AS v(name, slug, description, price, cat_slug, is_featured, stock)
LEFT JOIN categories c ON c.slug = v.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_featured = EXCLUDED.is_featured,
  stock = EXCLUDED.stock,
  updated_at = NOW();

DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE slug IN (
  'classic-red-rose-bouquet','blush-peony-arrangement','sunflower-bright-bundle','white-lily-elegance',
  'mixed-seasonal-blooms','orchid-luxury-pot','romantic-pink-rose-box','ethiopian-wildflower-mix'
));

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, v.url, v.alt, v.sort_order
FROM (VALUES
  ('classic-red-rose-bouquet', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', 'Classic red rose bouquet', 0),
  ('blush-peony-arrangement', 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80', 'Blush peony arrangement', 0),
  ('sunflower-bright-bundle', 'https://images.unsplash.com/photo-1597848212624-e430e4e0ab1d?w=800&q=80', 'Sunflower bright bundle', 0),
  ('white-lily-elegance', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', 'White lily elegance', 0),
  ('mixed-seasonal-blooms', 'https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=800&q=80', 'Mixed seasonal blooms', 0),
  ('orchid-luxury-pot', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80', 'Orchid luxury pot', 0),
  ('romantic-pink-rose-box', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80', 'Romantic pink rose box', 0),
  ('ethiopian-wildflower-mix', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', 'Ethiopian wildflower mix', 0)
) AS v(slug, url, alt, sort_order)
JOIN products p ON p.slug = v.slug;

-- ========== GALLERY DESIGNS ==========
INSERT INTO gallery_designs (
  title, slug, description, category_id, occasion, starting_price,
  is_featured, is_trending, is_new, materials, flower_types, color_palette, size
)
SELECT
  v.title, v.slug, v.description, c.id, v.occasion::event_type, v.starting_price,
  v.is_featured, v.is_trending, v.is_new,
  string_to_array(v.materials, '|'),
  string_to_array(v.flower_types, '|'),
  string_to_array(v.color_palette, '|'),
  v.size
FROM (VALUES
  ('White & Gold Wedding Elegance', 'white-gold-wedding',
   'A breathtaking wedding design featuring cascading white roses, soft peonies, and delicate gold accents. Perfect for luxury ceremonies and receptions. Includes bridal table, entrance arch, and guest table arrangements.',
   'weddings', 'WEDDING', 45000::numeric, true, true, false,
   'White Roses|Peonies|Eucalyptus|Gold Leaf Accents|Crystal Vases', 'Rose|Peony|Eucalyptus',
   '#FFFFFF|#F5E6C8|#C9A86C|#E8DFD8', 'Full Venue'),
  ('Romantic Rose Bouquet', 'romantic-rose-bouquet',
   'Hand-tied bouquet of premium long-stem red and blush roses with soft greenery. Ideal for proposals, anniversaries, or as a heartfelt gift. Delivered in an elegant gift box with optional greeting card.',
   'bouquets', 'OTHER', 3500::numeric, true, true, false,
   'Premium Roses|Ruscus|Satin Ribbon', 'Rose',
   '#8B2942|#D4A5A5|#F5E6E8|#FFFFFF', 'Medium'),
  ('Traditional Habesha Ceremony', 'habesha-ceremony',
   'Authentic Ethiopian traditional ceremony decoration featuring vibrant local flowers, cultural textiles, and elegant stage design. Designed for Timket, weddings, and cultural celebrations with deep respect for heritage.',
   'ethiopian-traditional', 'ETHIOPIAN_TRADITIONAL', 65000::numeric, true, false, true,
   'Local Ethiopian Flowers|Traditional Fabrics|Woven Baskets|Greenery', 'Ethiopian Local|Mixed',
   '#C9A86C|#8B2942|#A8B5A0|#FDFBF7', 'Full Venue'),
  ('Birthday Celebration Blooms', 'birthday-celebration',
   'Joyful and colorful birthday decoration package with balloon accents, table centerpieces, and a statement flower wall. Customizable color themes for any age.',
   'birthdays', 'BIRTHDAY', 12000::numeric, false, true, false,
   'Mixed Seasonal Flowers|Balloons|Greenery|Ribbons', 'Mixed|Sunflower|Rose',
   '#FF6B6B|#FFD93D|#6BCB77|#4D96FF', 'Medium Venue'),
  ('Elegant Bridal Bouquet', 'elegant-bridal-bouquet',
   'Classic cascading bridal bouquet with white roses, ranunculus, and soft foliage. Designed to complement any wedding dress and theme. Matching boutonnières available.',
   'weddings', 'WEDDING', 5500::numeric, true, false, true,
   'White Roses|Ranunculus|Ivy|Pearl Pins', 'Rose|Ranunculus',
   '#FFFFFF|#F8F4F0|#E8DFD8', 'Bridal'),
  ('Corporate Event Floral', 'corporate-event-floral',
   'Sophisticated and refined floral designs for corporate events, product launches, and conferences. Clean lines, premium blooms, and professional presentation.',
   'corporate', 'CORPORATE', 28000::numeric, false, false, false,
   'Orchids|Anthuriums|Monstera|Modern Vases', 'Orchid|Mixed',
   '#1A1A1A|#FFFFFF|#A8B5A0|#C9A86C', 'Large Venue'),
  ('Graduation Glory', 'graduation-glory',
   'Celebrate academic achievement with vibrant mixed bouquets and stage decorations. Available in school colors or classic graduation themes.',
   'graduation', 'GRADUATION', 4500::numeric, false, true, true,
   'Gerbera|Roses|Lilies|Greenery', 'Rose|Lily|Mixed',
   '#4D96FF|#FFD93D|#FFFFFF|#6BCB77', 'Medium'),
  ('Baby Shower Soft Pastels', 'baby-shower-pastels',
   'Gentle pastel arrangements perfect for baby showers. Soft pinks, blues, and creams with delicate blooms and optional gender-neutral options.',
   'baby-shower', 'BABY_SHOWER', 9500::numeric, false, false, true,
   'Carnations|Baby''s Breath|Roses|Pastel Ribbons', 'Rose|Mixed',
   '#FFB6C1|#ADD8E6|#FFF5EE|#E6E6FA', 'Medium Venue'),
  ('Engagement Ring of Flowers', 'engagement-ring-flowers',
   'Romantic engagement setup featuring a floral ring, candlelight, and intimate table decoration. Perfect for proposal moments and engagement parties.',
   'engagement', 'ENGAGEMENT', 18000::numeric, true, true, false,
   'Red Roses|Candles|Petals|Fairy Lights', 'Rose',
   '#8B2942|#FFFFFF|#C9A86C|#1A1A1A', 'Intimate'),
  ('Luxury Orchid Arrangement', 'luxury-orchid-arrangement',
   'Striking modern orchid arrangement in a premium ceramic vase. Long-lasting and sophisticated — ideal as a luxury gift or home statement piece.',
   'home-decor', 'OTHER', 4200::numeric, false, false, true,
   'Phalaenopsis Orchids|Ceramic Vase|Moss', 'Orchid',
   '#FFFFFF|#E8DFD8|#1A1A1A', 'Large'),
  ('Sunflower Joy Bouquet', 'sunflower-joy-bouquet',
   'Bright and cheerful sunflower bouquet mixed with seasonal blooms. Brings sunshine into any room — perfect for birthdays, get-well, or just because.',
   'bouquets', 'OTHER', 2800::numeric, false, true, false,
   'Sunflowers|Seasonal Filler|Kraft Paper', 'Sunflower|Mixed',
   '#FFD93D|#6BCB77|#F5E6C8', 'Medium'),
  ('Stage & Entrance Grandeur', 'stage-entrance-grandeur',
   'Dramatic stage backdrop and entrance floral installation for weddings and large events. Creates an unforgettable first impression with height, texture, and color.',
   'events', 'WEDDING', 85000::numeric, true, false, false,
   'Roses|Hydrangeas|Greenery Walls|Lighting Accents', 'Rose|Mixed',
   '#FFFFFF|#8B2942|#C9A86C|#A8B5A0', 'Full Venue')
) AS v(title, slug, description, cat_slug, occasion, starting_price, is_featured, is_trending, is_new, materials, flower_types, color_palette, size)
LEFT JOIN categories c ON c.slug = v.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  occasion = EXCLUDED.occasion,
  starting_price = EXCLUDED.starting_price,
  is_featured = EXCLUDED.is_featured,
  is_trending = EXCLUDED.is_trending,
  is_new = EXCLUDED.is_new,
  materials = EXCLUDED.materials,
  flower_types = EXCLUDED.flower_types,
  color_palette = EXCLUDED.color_palette,
  size = EXCLUDED.size,
  updated_at = NOW();

DELETE FROM gallery_images WHERE design_id IN (
  SELECT id FROM gallery_designs WHERE slug IN (
    'white-gold-wedding','romantic-rose-bouquet','habesha-ceremony','birthday-celebration',
    'elegant-bridal-bouquet','corporate-event-floral','graduation-glory','baby-shower-pastels',
    'engagement-ring-flowers','luxury-orchid-arrangement','sunflower-joy-bouquet','stage-entrance-grandeur'
  )
);

INSERT INTO gallery_images (design_id, url, alt, sort_order)
SELECT d.id, v.url, v.alt, v.sort_order
FROM (VALUES
  ('white-gold-wedding', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80', 'White and gold wedding setup', 0),
  ('white-gold-wedding', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80', 'Wedding table decoration', 1),
  ('white-gold-wedding', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80', 'Bridal arrangement', 2),
  ('romantic-rose-bouquet', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80', 'Romantic rose bouquet', 0),
  ('romantic-rose-bouquet', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80', 'Rose close-up', 1),
  ('habesha-ceremony', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80', 'Traditional ceremony decoration', 0),
  ('habesha-ceremony', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80', 'Cultural floral arrangement', 1),
  ('birthday-celebration', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80', 'Birthday celebration setup', 0),
  ('birthday-celebration', 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&q=80', 'Colorful birthday flowers', 1),
  ('elegant-bridal-bouquet', 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1200&q=80', 'Elegant bridal bouquet', 0),
  ('elegant-bridal-bouquet', 'https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=1200&q=80', 'Bridal flowers detail', 1),
  ('corporate-event-floral', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80', 'Corporate floral arrangement', 0),
  ('corporate-event-floral', 'https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=1200&q=80', 'Modern corporate flowers', 1),
  ('graduation-glory', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80', 'Graduation flowers', 0),
  ('graduation-glory', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80', 'Celebration bouquet', 1),
  ('baby-shower-pastels', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80', 'Baby shower flowers', 0),
  ('baby-shower-pastels', 'https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=1200&q=80', 'Pastel arrangement', 1),
  ('engagement-ring-flowers', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80', 'Engagement floral setup', 0),
  ('engagement-ring-flowers', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80', 'Romantic roses', 1),
  ('luxury-orchid-arrangement', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80', 'Luxury orchid arrangement', 0),
  ('luxury-orchid-arrangement', 'https://images.unsplash.com/photo-1487530811176-3780da8804eb?w=1200&q=80', 'Orchid detail', 1),
  ('sunflower-joy-bouquet', 'https://images.unsplash.com/photo-1597848212624-e430e4e0ab1d?w=1200&q=80', 'Sunflower bouquet', 0),
  ('sunflower-joy-bouquet', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80', 'Bright flowers', 1),
  ('stage-entrance-grandeur', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80', 'Grand stage decoration', 0),
  ('stage-entrance-grandeur', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80', 'Entrance floral arch', 1)
) AS v(slug, url, alt, sort_order)
JOIN gallery_designs d ON d.slug = v.slug;

INSERT INTO site_settings (key, value) VALUES
  ('currency', '"ETB"'),
  ('default_locale', '"am"'),
  ('supported_locales', '["am","en"]'),
  ('studio_city', '"Addis Ababa"'),
  ('studio_country', '"Ethiopia"')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

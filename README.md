# Decore — Premium Flowers & Event Decorations

Luxury flower studio and event decoration platform for **Ethiopia**.

**Where Flowers Become Memories. / አበቦች ትውስታ ይሆናሉ።**

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + custom luxury design system
- Framer Motion + React Three Fiber (3D hero)
- **Supabase** (Auth, PostgreSQL, Storage) — real database
- React Hook Form + Zod
- i18n: **Amharic (default)** + English
- Lucide Icons · Vercel

## Features

- Cinematic 3D hero with floating flowers
- Design gallery with search, filters, detail pages (Amharic + English)
- Custom flower design builder
- Event decoration booking system
- Full cart, checkout (ETB, Ethiopian cities, COD / bank transfer)
- Order tracking (customer + admin)
- Customer auth & account dashboard
- Admin dashboard
- Flowers shop with product catalog
- About, Contact, FAQ
- Floating WhatsApp button
- SEO: metadata, sitemap

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill Supabase URL + anon key (see Database below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database (Supabase — real data)

1. Create a project at [supabase.com](https://supabase.com)
2. In **SQL Editor**, run in order:
   - `supabase/schema.sql` — tables, RLS, categories, delivery zones
   - `supabase/storage.sql` — storage buckets
   - `supabase/seed.sql` — **products, designs, images** (12 designs + 8 products)
3. Project Settings → API → copy **URL** and **anon public** key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

4. Restart `npm run dev`

Without Supabase keys, the app still works using **static fallback** data in `src/lib/data/`.

### Data APIs

| Endpoint | Description |
|----------|-------------|
| `GET /api/designs` | Designs from Supabase (or static fallback) |
| `GET /api/products` | Products from Supabase (or static fallback) |

Helpers: `src/lib/db/designs.ts`, `src/lib/db/products.ts`

## Language

Default UI language is **Amharic** (`am`). Toggle **አማ / EN** in the navbar. Preference is stored in `localStorage`.

## Deploy (Vercel)

```bash
npx vercel
```

Connect the GitHub repo and set the same env vars in the Vercel dashboard.

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Homepage + 3D hero |
| `/designs` | Design gallery |
| `/designs/[slug]` | Design detail |
| `/flowers` | Flower products |
| `/custom-design` | Build your own |
| `/booking` | Event decoration booking |
| `/cart` → `/checkout` | E-commerce flow |
| `/orders` | Order history |
| `/admin` | Admin dashboard |
| `/login` `/register` | Auth |

---

Built for beauty, love, celebration & luxury 🌸 · Ethiopia

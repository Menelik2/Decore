# Decore — Premium Flowers & Event Decorations

Luxury flower studio and event decoration platform for Ethiopia.

**Where Flowers Become Memories.**

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + custom luxury design system
- Framer Motion + React Three Fiber (3D hero)
- Supabase-ready (Auth, PostgreSQL, Storage, Realtime)
- React Hook Form + Zod
- Lucide Icons · Vercel

## Features

- Cinematic 3D hero with floating flowers (reduced-motion & low-end fallbacks)
- Design gallery with search, filters, detail pages
- Custom flower design builder (7-step wizard)
- Event decoration booking system
- Full cart, checkout (ETB, Ethiopian cities, COD/bank transfer)
- Order tracking (customer + admin status updates)
- Customer auth & account dashboard
- Admin dashboard (orders, designs, analytics shell)
- Flowers shop, About, Contact, FAQ
- Floating WhatsApp button
- SEO: metadata, sitemap, robots.txt

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add Supabase keys when ready
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

1. Create a Supabase project
2. Run `supabase/schema.sql` in the SQL Editor
3. Create storage buckets listed in the schema comments
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deploy (Vercel)

```bash
npx vercel
```

Or connect the GitHub repo in the Vercel dashboard. Set env vars for production.

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Homepage + 3D hero |
| `/designs` | Design gallery |
| `/custom-design` | Build your own |
| `/booking` | Event decoration booking |
| `/flowers` | Flower products |
| `/cart` → `/checkout` | E-commerce flow |
| `/orders` | Order history |
| `/admin` | Admin dashboard |
| `/login` `/register` | Auth |

---

Built for beauty, love, celebration & luxury 🌸

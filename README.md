# Decore — Premium Flowers & Event Decorations

Luxury flower studio and event decoration platform for Ethiopia.

**Where Flowers Become Memories.**

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + custom design system
- **Framer Motion** — elegant animations
- **Three.js / React Three Fiber** — 3D experiences (coming)
- **Supabase** — Auth, PostgreSQL, Storage, Realtime
- **React Hook Form + Zod** — forms & validation
- **Lucide Icons**
- **Vercel** ready

## Features

- Cinematic hero with floating floral elements
- Design gallery with categories & filters
- Custom flower design builder
- Event decoration booking system
- Full e-commerce order flow
- Customer dashboard
- Admin dashboard with analytics
- Ethiopia-specific (ETB, cities, Telebirr/CBE ready)
- Realtime order tracking architecture
- Secure RLS policies

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your Supabase keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

1. Create a new Supabase project
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Create storage buckets: `product-images`, `gallery-images`, `event-images`, `customer-uploads`, `videos`, `site-assets`
4. Add your Supabase URL and anon key to `.env.local`

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Login & Register
│   ├── admin/            # Admin dashboard
│   ├── designs/          # Design gallery
│   ├── flowers/          # Flower products
│   ├── booking/          # Event booking
│   └── ...
├── components/
│   ├── ui/               # Base UI components
│   ├── layout/           # Navbar, Footer
│   ├── home/             # Homepage sections
│   └── ...
├── lib/
│   ├── supabase/         # Supabase clients
│   └── utils.ts
├── types/                # TypeScript types
└── hooks/
```

## Current Status

✅ Project foundation & design system  
✅ Homepage with Hero, Featured Designs, Occasions, CTA  
✅ Navbar & Footer  
✅ Full database schema + RLS  
✅ Supabase client setup  
✅ Core routing structure  
🚧 Full gallery, custom builder, booking forms  
🚧 3D flower experience  
🚧 Admin dashboard  
🚧 Authentication flows  
🚧 Order system  

---

Built for beauty, love, celebration & luxury 🌸

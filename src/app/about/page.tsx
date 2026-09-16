import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Decore is a premium flower studio and event decoration company in Ethiopia.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
          Our Story
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-burgundy leading-tight mb-6">
          Where Flowers Become Memories
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Decore is a luxury flower studio and event decoration house based in
          Ethiopia. We craft arrangements and full venue experiences for weddings,
          celebrations, and the quiet moments that matter most.
        </p>
      </section>

      <section className="bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-burgundy text-center mb-12">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🌸", title: "Beauty", text: "Every stem is chosen with intention. We design for impact and emotion." },
              { emoji: "❤️", title: "Love", text: "From proposals to anniversaries, we help you say what words cannot." },
              { emoji: "🎉", title: "Celebration", text: "Weddings, graduations, cultural ceremonies — we elevate every occasion." },
              { emoji: "💎", title: "Luxury", text: "Premium materials, refined styling, and service that feels personal." },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl bg-white border border-border p-6 text-center">
                <span className="text-3xl mb-3 block">{v.emoji}</span>
                <h3 className="font-medium text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block">🇪🇹</span>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deep-burgundy mb-4">
            Rooted in Ethiopia
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We understand Habesha ceremonies, local venues, and the colors and
            flowers that feel like home. Delivery across Addis Ababa and major
            cities, with Telebirr and bank transfer ready when you need them.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/designs">
              <Button size="lg">Explore Designs</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

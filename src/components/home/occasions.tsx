"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const occasions = [
  { name: "Wedding", emoji: "💍", href: "/designs?category=weddings", color: "from-rose/20 to-blush/30" },
  { name: "Birthday", emoji: "🎂", href: "/designs?category=birthdays", color: "from-gold/20 to-champagne/40" },
  { name: "Engagement", emoji: "❤️", href: "/designs?category=engagement", color: "from-primary/15 to-rose/20" },
  { name: "Graduation", emoji: "🎓", href: "/designs?category=graduation", color: "from-soft-green/20 to-muted" },
  { name: "Baby Shower", emoji: "👶", href: "/designs?category=baby-shower", color: "from-blush/25 to-champagne/30" },
  { name: "Corporate", emoji: "🏢", href: "/designs?category=corporate", color: "from-muted to-border/50" },
  { name: "Traditional", emoji: "🇪🇹", href: "/designs?category=ethiopian-traditional", color: "from-gold/25 to-rose/15" },
  { name: "Gift", emoji: "🎁", href: "/flowers", color: "from-secondary to-blush/20" },
]

export function Occasions() {
  return (
    <section className="section-padding bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            Celebrate
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-deep-burgundy">
            What are you celebrating?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            From intimate gatherings to grand celebrations, we create moments that last forever.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {occasions.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={`group flex flex-col items-center justify-center gap-3 p-6 md:p-8 rounded-2xl bg-gradient-to-br ${item.color} border border-border/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <span className="text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110">
                  {item.emoji}
                </span>
                <span className="font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Gem,
  Cake,
  Heart,
  GraduationCap,
  Baby,
  Building2,
  Sparkles,
  Gift,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Occasion = {
  name: string
  href: string
  icon: LucideIcon
  tint: string
  iconColor: string
  blurb: string
}

const occasions: Occasion[] = [
  { name: "Wedding", href: "/designs?category=weddings", icon: Gem, tint: "from-rose-100/80 to-white/40", iconColor: "text-[#8B2942]", blurb: "Aisles & arches" },
  { name: "Birthday", href: "/designs?category=birthdays", icon: Cake, tint: "from-amber-100/80 to-white/40", iconColor: "text-[#C9A86C]", blurb: "Tables & setups" },
  { name: "Engagement", href: "/designs?category=engagement", icon: Heart, tint: "from-pink-100/80 to-white/40", iconColor: "text-[#c23a5a]", blurb: "Intimate looks" },
  { name: "Graduation", href: "/designs?category=graduation", icon: GraduationCap, tint: "from-emerald-100/70 to-white/40", iconColor: "text-[#3d6b4f]", blurb: "Proud moments" },
  { name: "Baby Shower", href: "/designs?category=baby-shower", icon: Baby, tint: "from-sky-100/80 to-white/40", iconColor: "text-[#5a7a9a]", blurb: "Soft spaces" },
  { name: "Corporate", href: "/designs?category=corporate", icon: Building2, tint: "from-slate-100/80 to-white/40", iconColor: "text-[#4a4a50]", blurb: "Events & lobbies" },
  { name: "Traditional", href: "/designs?category=ethiopian-traditional", icon: Sparkles, tint: "from-orange-100/70 to-white/40", iconColor: "text-[#8B5A2B]", blurb: "Ethiopian style" },
  { name: "Gift", href: "/flowers", icon: Gift, tint: "from-violet-100/70 to-white/40", iconColor: "text-[#6b4a7a]", blurb: "Same-day florals" },
]

export function Occasions() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 glass-mesh opacity-60 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <motion.div
          className="mb-10 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[13px] font-semibold text-primary tracking-wide mb-2">
            Celebrate
          </p>
          <h2 className="text-[28px] md:text-[34px] font-bold tracking-tight text-label leading-[1.15]">
            What are you celebrating?
          </h2>
          <p className="mt-2.5 text-[15px] text-label-secondary">
            Pick an occasion — we’ll match florals and décor.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {occasions.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.04, 0.28),
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ perspective: 800 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex flex-col items-start justify-between",
                    "min-h-[140px] sm:min-h-[152px] p-4 sm:p-5",
                    "rounded-[22px] glass",
                    "bg-gradient-to-br",
                    item.tint,
                    "active:scale-[0.97] transition-transform duration-200",
                    "hover:-translate-y-1 hover:shadow-lg"
                  )}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/60 backdrop-blur-md shadow-sm border border-white/50 transition-transform duration-200 group-hover:scale-110">
                    <Icon className={cn("h-5 w-5", item.iconColor)} strokeWidth={1.75} />
                  </div>
                  <div className="mt-4 w-full">
                    <p className="text-[15px] sm:text-[16px] font-semibold tracking-tight text-label">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-label-secondary">
                      {item.blurb}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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
  {
    name: "Wedding",
    href: "/designs?category=weddings",
    icon: Gem,
    tint: "bg-[#f5e6ea]",
    iconColor: "text-[#8B2942]",
    blurb: "Aisles, arches & bouquets",
  },
  {
    name: "Birthday",
    href: "/designs?category=birthdays",
    icon: Cake,
    tint: "bg-[#f7f0e4]",
    iconColor: "text-[#C9A86C]",
    blurb: "Tables & surprise setups",
  },
  {
    name: "Engagement",
    href: "/designs?category=engagement",
    icon: Heart,
    tint: "bg-[#fce8ec]",
    iconColor: "text-[#c23a5a]",
    blurb: "Intimate & romantic",
  },
  {
    name: "Graduation",
    href: "/designs?category=graduation",
    icon: GraduationCap,
    tint: "bg-[#e8f0ea]",
    iconColor: "text-[#3d6b4f]",
    blurb: "Proud moments, styled",
  },
  {
    name: "Baby Shower",
    href: "/designs?category=baby-shower",
    icon: Baby,
    tint: "bg-[#eef2f8]",
    iconColor: "text-[#5a7a9a]",
    blurb: "Soft & joyful spaces",
  },
  {
    name: "Corporate",
    href: "/designs?category=corporate",
    icon: Building2,
    tint: "bg-[#f0f0f2]",
    iconColor: "text-[#4a4a50]",
    blurb: "Events & lobbies",
  },
  {
    name: "Traditional",
    href: "/designs?category=ethiopian-traditional",
    icon: Sparkles,
    tint: "bg-[#f5ebe0]",
    iconColor: "text-[#8B5A2B]",
    blurb: "Ethiopian celebrations",
  },
  {
    name: "Gift",
    href: "/flowers",
    icon: Gift,
    tint: "bg-[#f3eef6]",
    iconColor: "text-[#6b4a7a]",
    blurb: "Same-day florals",
  },
]

export function Occasions() {
  return (
    <section className="py-16 md:py-20 bg-[#f5f5f7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="mb-10 md:mb-12 max-w-xl">
          <p className="text-[13px] font-semibold text-primary tracking-wide mb-2">
            Celebrate
          </p>
          <h2 className="text-[28px] md:text-[34px] font-bold tracking-tight text-label leading-[1.15]">
            What are you celebrating?
          </h2>
          <p className="mt-2.5 text-[15px] text-label-secondary leading-relaxed">
            Pick an occasion — we’ll match florals and décor to the moment.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {occasions.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.04, 0.28),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex flex-col items-start justify-between",
                    "min-h-[132px] sm:min-h-[148px] p-4 sm:p-5",
                    "rounded-[20px] border border-black/[0.04]",
                    "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]",
                    "transition-all duration-200 ease-out",
                    "active:scale-[0.97] hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
                    "hover:-translate-y-0.5",
                    item.tint
                  )}
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center",
                      "rounded-[14px] bg-white/70 backdrop-blur-sm",
                      "shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
                      "transition-transform duration-200 group-hover:scale-105"
                    )}
                  >
                    <Icon
                      className={cn("h-5 w-5 sm:h-[22px] sm:w-[22px]", item.iconColor)}
                      strokeWidth={1.75}
                    />
                  </div>

                  <div className="mt-4 w-full">
                    <p className="text-[15px] sm:text-[16px] font-semibold tracking-tight text-label">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[12px] sm:text-[13px] text-label-secondary line-clamp-1">
                      {item.blurb}
                    </p>
                  </div>

                  <span
                    className="pointer-events-none absolute top-4 right-4 h-6 w-6 rounded-full bg-black/[0.04] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M3 1.5L7 5L3 8.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-label-secondary"
                      />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

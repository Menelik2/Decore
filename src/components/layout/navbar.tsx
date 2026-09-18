"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, Heart, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

const navLinks = [
  { href: "/flowers", label: "Flowers" },
  { href: "/designs", label: "Designs" },
  { href: "/decorations", label: "Decorations" },
  { href: "/custom-design", label: "Custom" },
  { href: "/booking", label: "Book Event" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "pt-[env(safe-area-inset-top)]",
        scrolled || isOpen
          ? "bg-white/75 backdrop-blur-[20px] backdrop-saturate-180 border-b border-black/[0.06]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="flex h-12 md:h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 group pressable">
            <span className="text-xl leading-none">🌸</span>
            <span className="text-[17px] font-semibold tracking-tight text-label group-hover:text-primary transition-colors">
              Decore
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname?.startsWith(link.href + "/")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-200",
                    active
                      ? "text-primary bg-primary/8"
                      : "text-label-secondary hover:text-label hover:bg-fill-secondary"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-0">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-11 w-11 text-label-secondary hover:text-label"
              aria-label="Search"
            >
              <Search className="h-[20px] w-[20px] stroke-[1.75]" />
            </Button>
            <Link href="/favorites">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 text-label-secondary hover:text-label"
                aria-label="Favorites"
              >
                <Heart className="h-[20px] w-[20px] stroke-[1.75]" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-11 w-11 text-label-secondary hover:text-label"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[20px] w-[20px] stroke-[1.75]" />
                {itemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/account" className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 text-label-secondary hover:text-label"
                aria-label="Account"
              >
                <User className="h-[20px] w-[20px] stroke-[1.75]" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-11 w-11 text-label-secondary hover:text-label"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-[22px] w-[22px] stroke-[1.75]" />
              ) : (
                <Menu className="h-[22px] w-[22px] stroke-[1.75]" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden border-t border-black/[0.06] bg-white/90 backdrop-blur-[24px] backdrop-saturate-180"
          >
            <nav className="flex flex-col px-3 py-3 gap-0.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3.5 text-[17px] font-medium rounded-xl transition-colors min-h-[48px] flex items-center",
                      active
                        ? "text-primary bg-primary/8"
                        : "text-label hover:bg-fill-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="mt-2 pt-3 border-t border-black/[0.06] flex gap-2.5 px-1">
                <Link href="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram, Facebook, Phone, Mail, MapPin, MessageCircle } from "lucide-react"

const footerLinks = {
  shop: [
    { href: "/flowers", label: "Flowers" },
    { href: "/designs", label: "Design Gallery" },
    { href: "/decorations", label: "Event Decorations" },
    { href: "/custom-design", label: "Custom Design" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/booking", label: "Book an Event" },
  ],
  account: [
    { href: "/account", label: "My Account" },
    { href: "/orders", label: "Order History" },
    { href: "/favorites", label: "Wishlist" },
    { href: "/cart", label: "Cart" },
  ],
}

export function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  return (
    <footer className="bg-deep-burgundy text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl">🌸</span>
              <span className="font-serif text-2xl font-semibold tracking-tight">
                Decore
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-6">
              Premium flowers and event decorations crafted with love in Ethiopia.
              Where flowers become memories.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/2519XXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-gold mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-gold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-gold mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href="tel:+2519XXXXXXXX" className="hover:text-white transition-colors">
                  +251 9XX XXX XXX
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a href="mailto:hello@decore.et" className="hover:text-white transition-colors">
                  hello@decore.et
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Decore. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link href="/privacy" className="hover:text-white/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/80 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

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
    <footer className="bg-[#1d1d1f] text-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1.5 mb-4 pressable">
              <span className="text-xl">🌸</span>
              <span className="text-[19px] font-semibold tracking-tight">
                Decore
              </span>
            </Link>
            <p className="text-white/55 text-[15px] leading-relaxed max-w-sm mb-6">
              Premium flowers and event decorations crafted with love in Ethiopia.
              Where flowers become memories.
            </p>
            <div className="flex items-center gap-2">
              {[
                { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
                { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
                { href: "https://wa.me/2519XXXXXXXX", icon: MessageCircle, label: "WhatsApp" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/16 active:scale-95 transition-all"
                  aria-label={label}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white/40 uppercase tracking-wide mb-3">
              Shop
            </h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-white/70 hover:text-white transition-colors py-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white/40 uppercase tracking-wide mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-white/70 hover:text-white transition-colors py-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white/40 uppercase tracking-wide mb-3">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-[15px] text-white/70">
                <MapPin className="h-4 w-4 mt-1 shrink-0 text-white/40" strokeWidth={1.75} />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5 text-[15px] text-white/70">
                <Phone className="h-4 w-4 shrink-0 text-white/40" strokeWidth={1.75} />
                <a href="tel:+2519XXXXXXXX" className="hover:text-white transition-colors">
                  +251 9XX XXX XXX
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[15px] text-white/70">
                <Mail className="h-4 w-4 shrink-0 text-white/40" strokeWidth={1.75} />
                <a href="mailto:hello@decore.et" className="hover:text-white transition-colors">
                  hello@decore.et
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-white/40">
            © {new Date().getFullYear()} Decore. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[12px] text-white/40">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

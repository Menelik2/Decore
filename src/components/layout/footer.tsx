"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram, Facebook, Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import { useTranslations } from "@/lib/i18n/locale-context"

export function Footer() {
  const t = useTranslations()
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  const footerLinks = {
    shop: [
      { href: "/flowers", label: t("Footer.flowers") },
      { href: "/designs", label: t("Footer.designGallery") },
      { href: "/decorations", label: t("Footer.eventDecorations") },
      { href: "/custom-design", label: t("Footer.customDesign") },
    ],
    company: [
      { href: "/about", label: t("Footer.aboutUs") },
      { href: "/contact", label: t("Footer.contact") },
      { href: "/faq", label: t("Footer.faq") },
      { href: "/booking", label: t("Footer.bookAnEvent") },
    ],
    account: [
      { href: "/account", label: t("Footer.myAccount") },
      { href: "/orders", label: t("Footer.orderHistory") },
      { href: "/favorites", label: t("Footer.wishlist") },
      { href: "/cart", label: t("Footer.cart") },
    ],
  }

  return (
    <footer className="bg-[#1d1d1f] text-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1.5 mb-4 pressable">
              <span className="text-xl">🌸</span>
              <span className="text-[19px] font-semibold tracking-tight">
                ዲኮር
              </span>
            </Link>
            <p className="text-white/55 text-[15px] leading-relaxed max-w-sm mb-6">
              {t("Footer.tagline")}
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
              {t("Footer.shop")}
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
              {t("Footer.company")}
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
              {t("Footer.contactTitle")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-[15px] text-white/70">
                <MapPin className="h-4 w-4 mt-1 shrink-0 text-white/40" strokeWidth={1.75} />
                <span>{t("Footer.location")}</span>
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
            © {new Date().getFullYear()} ዲኮር. {t("Footer.rights")}
          </p>
          <div className="flex items-center gap-5 text-[12px] text-white/40">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              {t("Footer.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              {t("Footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

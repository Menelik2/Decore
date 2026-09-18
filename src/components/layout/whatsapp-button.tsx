"use client"

import { usePathname } from "next/navigation"
import { MessageCircle } from "lucide-react"

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2519XXXXXXXX"

export function WhatsAppButton() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  return (
    <a
      href={`https://wa.me/${WA_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.4)] transition-transform duration-200 active:scale-90 hover:scale-105"
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        right: "max(1.25rem, env(safe-area-inset-right))",
      }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
    </a>
  )
}

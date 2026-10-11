"use client"

import { CartProvider } from "@/lib/cart-context"
import { LocaleProvider } from "@/lib/i18n/locale-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <CartProvider>{children}</CartProvider>
    </LocaleProvider>
  )
}

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart, isHydrated } = useCart()

  if (!isHydrated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24">
        <p className="text-muted-foreground animate-pulse">Loading cart...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-deep-burgundy mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          Explore our designs and add something beautiful.
        </p>
        <div className="flex gap-3">
          <Link href="/designs">
            <Button>Browse Designs</Button>
          </Link>
          <Link href="/flowers">
            <Button variant="outline">Shop Flowers</Button>
          </Link>
        </div>
      </div>
    )
  }

  const deliveryEstimate = subtotal >= 3000 ? 0 : 150
  const total = subtotal + deliveryEstimate

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-deep-burgundy">
              Shopping Cart
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
            Clear cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 rounded-2xl border border-border bg-white"
              >
                <div className="h-24 w-24 rounded-xl overflow-hidden bg-muted shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl">
                      🌸
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-foreground leading-snug">
                        {item.slug ? (
                          <Link
                            href={`/designs/${item.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-l-full transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-r-full transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 space-y-4">
              <h2 className="font-serif text-xl font-semibold text-deep-burgundy">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">
                    {deliveryEstimate === 0 ? (
                      <span className="text-soft-green">Free</span>
                    ) : (
                      formatPrice(deliveryEstimate)
                    )}
                  </span>
                </div>
                {subtotal < 3000 && (
                  <p className="text-xs text-muted-foreground">
                    Free delivery on orders over {formatPrice(3000)} (Addis Ababa)
                  </p>
                )}
                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full gap-2" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/designs" className="block">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Check,
  Loader2,
  MapPin,
  Phone,
  User,
  Mail,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { formatPrice, cn } from "@/lib/utils"
import { ETHIOPIAN_CITIES } from "@/types"

const PAYMENT_METHODS = [
  {
    id: "cod",
    name: "Cash on Delivery",
    desc: "Pay when you receive your order",
    enabled: true,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    desc: "CBE / other bank transfer — details after order",
    enabled: true,
  },
  {
    id: "telebirr",
    name: "Telebirr",
    desc: "Mobile money (coming soon)",
    enabled: false,
  },
  {
    id: "cbe_birr",
    name: "CBE Birr",
    desc: "Commercial Bank of Ethiopia (coming soon)",
    enabled: false,
  },
]

const DELIVERY_FEES: Record<string, number> = {
  "Addis Ababa": 150,
  "Bahir Dar": 350,
  Gondar: 400,
  Hawassa: 300,
  Mekelle: 450,
  "Dire Dawa": 400,
  Adama: 250,
  Jimma: 400,
  Dessie: 400,
  Other: 500,
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("Addis Ababa")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [payment, setPayment] = useState("cod")
  const [loading, setLoading] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const baseFee = DELIVERY_FEES[city] ?? 500
  const freeThreshold = city === "Addis Ababa" ? 3000 : 5000
  const deliveryFee = subtotal >= freeThreshold ? 0 : baseFee
  const total = subtotal + deliveryFee

  if (items.length === 0 && !placed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24">
        <h1 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
          Nothing to checkout
        </h1>
        <p className="text-muted-foreground mb-6">Your cart is empty.</p>
        <Link href="/designs">
          <Button>Browse Designs</Button>
        </Link>
      </div>
    )
  }

  if (placed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-6">🌸</div>
          <h1 className="font-serif text-3xl font-semibold text-deep-burgundy mb-2">
            Order Placed
          </h1>
          <p className="text-muted-foreground mb-1">
            Thank you, {name}! Your order has been received.
          </p>
          <p className="text-lg font-medium text-foreground mb-2">
            Order #{orderNumber}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            We&apos;ll confirm on {phone}. Total: {formatPrice(total)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/orders/${orderNumber}`}>
              <Button>View Order</Button>
            </Link>
            <Link href="/designs">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const canSubmit =
    name.trim().length > 1 &&
    phone.trim().length >= 9 &&
    address.trim().length > 3 &&
    !!city &&
    !!payment

  const handlePlaceOrder = async () => {
    if (!canSubmit) return
    setLoading(true)

    // Simulate order creation — replace with Supabase insert when connected
    await new Promise((r) => setTimeout(r, 1000))

    const num = `DEC-${Date.now().toString(36).toUpperCase()}`
    
    // Persist order locally for demo tracking
    try {
      const orders = JSON.parse(localStorage.getItem("decore-orders") || "[]")
      orders.unshift({
        id: num,
        order_number: num,
        status: "PENDING",
        customer_name: name,
        customer_phone: phone,
        customer_email: email || null,
        delivery_address: address,
        city,
        preferred_date: date || null,
        preferred_time: time || null,
        notes: notes || null,
        subtotal,
        delivery_fee: deliveryFee,
        discount: 0,
        total,
        payment_method: payment,
        payment_status: "PENDING",
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unit_price: i.price,
          total_price: i.price * i.quantity,
          image: i.image,
        })),
        created_at: new Date().toISOString(),
      })
      localStorage.setItem("decore-orders", JSON.stringify(orders))
    } catch {
      // ignore
    }

    clearCart()
    setOrderNumber(num)
    setPlaced(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>

        <h1 className="font-serif text-3xl font-semibold text-deep-burgundy mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact */}
            <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
              <h2 className="font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Contact details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Full name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 9XX XXX XXX"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
              <h2 className="font-medium text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Delivery
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, building, landmark..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <select
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-input bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {ETHIOPIAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred delivery date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="pl-10"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Order notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Gift message, gate code, special requests..."
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-border bg-white p-6 space-y-4">
              <h2 className="font-medium text-foreground">Payment method</h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={!m.enabled}
                    onClick={() => m.enabled && setPayment(m.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                      !m.enabled && "opacity-50 cursor-not-allowed",
                      payment === m.id && m.enabled
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        payment === m.id && m.enabled
                          ? "border-primary bg-primary"
                          : "border-border"
                      )}
                    >
                      {payment === m.id && m.enabled && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 space-y-4">
              <h2 className="font-serif text-xl font-semibold text-deep-burgundy">
                Order Summary
              </h2>

              <ul className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm gap-2">
                    <span className="text-muted-foreground truncate">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 text-sm pt-3 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery ({city})</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-soft-green">Free</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!canSubmit || loading}
                onClick={handlePlaceOrder}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing order...
                  </>
                ) : (
                  `Place Order · ${formatPrice(total)}`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By placing this order you agree to our terms. We&apos;ll confirm by phone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

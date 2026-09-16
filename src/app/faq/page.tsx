"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "Which cities do you deliver to?",
    a: "We deliver across Addis Ababa and major cities including Bahir Dar, Gondar, Hawassa, Mekelle, Dire Dawa, Adama, and more. Delivery fees vary by location; Addis Ababa orders over 3,000 ETB often qualify for free delivery.",
  },
  {
    q: "How far in advance should I book event decorations?",
    a: "For weddings and large events we recommend booking at least 2–4 weeks ahead. Smaller arrangements can often be arranged with a few days’ notice, depending on the season and flower availability.",
  },
  {
    q: "Can I customize a design from the gallery?",
    a: "Yes. Use “Customize Similar” on any design page, or our Custom Design builder to choose occasion, flowers, colors, size, and add-ons. We’ll confirm details and pricing with you.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on delivery and bank transfer are available now. Telebirr and CBE Birr can be enabled by the business. We’ll confirm payment details when your order is accepted.",
  },
  {
    q: "Do you offer traditional Ethiopian ceremony decorations?",
    a: "Absolutely. We specialize in Habesha and traditional ceremony styling — stage, entrance, table, and full venue — with respect for cultural details and color preferences.",
  },
  {
    q: "How do I track my order?",
    a: "After checkout you’ll receive an order number. Sign in to your account and open My Orders to see status updates: Pending, Confirmed, Preparing, Ready, Out for Delivery, and Completed.",
  },
  {
    q: "Can I include a gift message?",
    a: "Yes. Add a note at checkout or when building a custom design. Greeting cards and custom message cards are also available as add-ons.",
  },
  {
    q: "What if I need to change or cancel an order?",
    a: "Contact us as soon as possible by phone or WhatsApp. Changes and cancellations depend on how far preparation has progressed; we’ll always try to accommodate you.",
  },
]

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-border rounded-2xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-medium text-sm sm:text-base text-foreground">{q}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            Help
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-deep-burgundy mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-sm">
            Quick answers about orders, delivery, and decorations
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FaqItem
              key={i}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-12 text-center rounded-2xl border border-border bg-white p-8">
          <p className="font-medium text-foreground mb-2">Still have questions?</p>
          <p className="text-sm text-muted-foreground mb-5">
            We’re happy to help by phone, WhatsApp, or email.
          </p>
          <Link href="/contact">
            <Button>Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

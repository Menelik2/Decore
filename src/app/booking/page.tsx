"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { BookingForm } from "@/components/booking/booking-form"

function BookingFormFallback() {
  return (
    <div className="max-w-3xl mx-auto py-20 text-center text-muted-foreground">
      Loading booking form...
    </div>
  )
}

export default function BookingPage() {
  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            Book
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-burgundy mb-3">
            Event Decoration Booking
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tell us about your event and we'll create a stunning decoration plan
            tailored to your vision, venue, and budget.
          </p>
        </motion.div>

        <Suspense fallback={<BookingFormFallback />}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  )
}

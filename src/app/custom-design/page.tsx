"use client"

import { motion } from "framer-motion"
import { DesignBuilder } from "@/components/custom/design-builder"

export default function CustomDesignPage() {
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
            Create
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-deep-burgundy mb-3">
            Build Your Design
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Design a custom flower arrangement tailored to your occasion, style, and budget.
            We'll craft it with care.
          </p>
        </motion.div>

        <DesignBuilder />
      </div>
    </div>
  )
}

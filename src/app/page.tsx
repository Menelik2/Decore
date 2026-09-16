import { Hero } from "@/components/home/hero"
import { FeaturedDesigns } from "@/components/home/featured-designs"
import { Occasions } from "@/components/home/occasions"
import { CTA } from "@/components/home/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDesigns />
      <Occasions />
      <CTA />
    </>
  )
}

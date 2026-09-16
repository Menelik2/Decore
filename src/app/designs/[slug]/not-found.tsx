import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DesignNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24">
      <p className="text-6xl mb-4">🌸</p>
      <h1 className="font-serif text-2xl font-semibold text-deep-burgundy mb-2">
        Design not found
      </h1>
      <p className="text-muted-foreground mb-8 text-center">
        This design may have been removed or the link is incorrect.
      </p>
      <Link href="/designs">
        <Button>Back to Gallery</Button>
      </Link>
    </div>
  )
}

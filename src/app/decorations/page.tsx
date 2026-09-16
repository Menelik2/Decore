import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24 pb-16">
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-deep-burgundy mb-4">
        Event Decorations
      </h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        This page is under construction. The full experience is being built.
      </p>
      <Link href="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  )
}

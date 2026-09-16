import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Providers } from "@/components/providers"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Decore — Premium Flowers & Event Decorations",
    template: "%s | Decore",
  },
  description:
    "Beautiful flowers, elegant decorations, and unforgettable event experiences in Ethiopia. Luxury floral design and event decoration studio.",
  keywords: [
    "flowers Ethiopia",
    "wedding decoration Addis Ababa",
    "event decoration",
    "bridal bouquet",
    "Ethiopian traditional decoration",
    "flower delivery",
  ],
  openGraph: {
    type: "website",
    locale: "en_ET",
    siteName: "Decore",
    title: "Decore — Premium Flowers & Event Decorations",
    description:
      "Where Flowers Become Memories. Luxury floral design and event decoration in Ethiopia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Decore — Premium Flowers & Event Decorations",
    description: "Where Flowers Become Memories.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}

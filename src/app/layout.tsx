import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Playfair_Display, Noto_Sans_Ethiopic } from "next/font/google"
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

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "ዲኮር — ፕሪሚየም አበቦች እና የዝግጅት ጌጣጌጦች",
    template: "%s | ዲኮር",
  },
  description:
    "በኢትዮጵያ ውስጥ የሚገኝ የቅንጦት የአበባ ንድፍ እና የዝግጅት ጌጣጌጥ ስቱዲዮ። አበቦች ትውስታ ይሆናሉ።",
  keywords: [
    "አበቦች ኢትዮጵያ",
    "የሰርግ ጌጣጌጥ አዲስ አበባ",
    "የዝግጅት ጌጣጌጥ",
    "የሰርግ እቅፍ",
    "የኢትዮጵያ ባህላዊ ጌጣጌጥ",
    "flowers Ethiopia",
    "wedding decoration Addis Ababa",
    "event decoration",
  ],
  openGraph: {
    type: "website",
    locale: "am_ET",
    alternateLocale: ["en_ET"],
    siteName: "ዲኮር | Decore",
    title: "ዲኮር — ፕሪሚየም አበቦች እና የዝግጅት ጌጣጌጦች",
    description:
      "አበቦች ትውስታ ይሆናሉ። በኢትዮጵያ ውስጥ የቅንጦት የአበባ ንድፍ እና የዝግጅት ጌጣጌጥ።",
  },
  twitter: {
    card: "summary_large_image",
    title: "ዲኮር — ፕሪሚየም አበቦች እና የዝግጅት ጌጣጌጦች",
    description: "አበቦች ትውስታ ይሆናሉ።",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ዲኮር",
  },
  formatDetection: {
    telephone: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1d1f" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="am"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${notoEthiopic.variable} h-full antialiased`}
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

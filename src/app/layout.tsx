import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Happy Birthday Jhanvi 🎂",
  description: "A scrapbook made by everyone who loves Jhanvi",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="birthday-root">{children}</body>
    </html>
  )
}

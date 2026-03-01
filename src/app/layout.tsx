import type { Metadata } from "next"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "My Library — Reading Tracker",
  description: "Personal book library management program",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="font-sans antialiased bg-[#FAF9F6] text-[#5C4033]">
        {children}
      </body>
    </html>
  )
}
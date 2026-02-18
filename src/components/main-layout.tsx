"use client"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")

  if (isAuthPage) {
    return <main className="w-full min-h-screen">{children}</main>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[220px]">
        {children}
      </main>
    </div>
  )
}
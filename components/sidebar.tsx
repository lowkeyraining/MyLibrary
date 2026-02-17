"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Library, Heart, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "My Library", href: "/books", icon: Library },
  { label: "Favorites", href: "/favorites", icon: Heart },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-[#D4E5EF] border-r border-[#D9D2C7] flex flex-col py-7 z-50">
      <div className="px-6 mb-8 border-b border-[#D9D2C7] pb-6">
        <h1 className="text-[18px] font-bold tracking-[0.06em] text-[#5C4033]">My Library</h1>
        <p className="text-[10px] tracking-[2px] uppercase text-[#8B6F5E] mt-1">Reading Tracker</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 text-[10px] uppercase tracking-[1.5px] text-[#8B6F5E] mb-2">Main</p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all",
              pathname === item.href 
                ? "bg-[#5C4033]/10 text-[#5C4033] font-semibold" 
                : "text-[#8B6F5E] hover:bg-[#5C4033]/5 hover:text-[#5C4033]"
            )}
          >
            <item.icon size={16} strokeWidth={1.8} />
            {item.label}
          </Link>
        ))}

        <div className="pt-4">
          <p className="px-3 text-[10px] uppercase tracking-[1.5px] text-[#8B6F5E] mb-2">Account</p>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all text-[#8B6F5E] hover:bg-[#5C4033]/5 hover:text-[#5C4033]",
              pathname === "/settings" && "bg-[#5C4033]/10 text-[#5C4033] font-semibold"
            )}
          >
            <Settings size={16} strokeWidth={1.8} />
            Settings
          </Link>
        </div>
      </nav>

      <div className="px-3 mt-auto">
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-[#8B6F5E] hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={16} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
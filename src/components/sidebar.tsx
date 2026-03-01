"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Library, Heart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "My Library", href: "/books", icon: Library },
  { label: "Favorites", href: "/favorites", icon: Heart },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  // ดึงข้อมูล User มาแสดงที่ Sidebar แบบปลอดภัย (ไม่ต้องพึ่ง SessionProvider ให้วุ่นวาย)
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data?.user) setUser(data.user)
      })
      .catch(console.error)
  }, [])

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

      {/* ── User Card (กดเพื่อ Sign Out) ── */}
      <div className="px-2.5 mt-auto pt-4 border-t border-[#D9D2C7]">
        <button 
          onClick={() => {
            if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
              signOut({ callbackUrl: "/login" })
            }
          }}
          title="คลิกเพื่อออกจากระบบ"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-[#5C4033]/10 text-left group outline-none"
        >
          {/* ส่วนรูปภาพโปรไฟล์ */}
          <div className="w-[30px] h-[30px] rounded-full bg-[#C07B5A] flex items-center justify-center text-[12px] font-bold text-white shrink-0 overflow-hidden shadow-sm group-hover:opacity-90 transition-opacity">
            {user?.image ? (
              <img src={user.image} alt="User" className="w-full h-full object-cover" />
            ) : (
              user?.name ? user.name.charAt(0).toUpperCase() : "?"
            )}
          </div>
          
          {/* ส่วนชื่อและอีเมล */}
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-[#5C4033] truncate leading-tight mb-[2px]">
              {user?.name || "Loading..."}
            </div>
            <div className="text-[10px] text-[#8B6F5E] truncate leading-tight">
              {user?.email || "..."}
            </div>
          </div>
        </button>
      </div>
      
    </aside>
  )
}
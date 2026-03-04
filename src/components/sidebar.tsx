"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutGrid, Library, Heart, Settings, LogOut, UserPen } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import { getCurrentUser } from "@/actions/user"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "My Library", href: "/books", icon: Library },
  { label: "Favorites", href: "/favorites", icon: Heart },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getCurrentUser()
      .then(data => { if (data) setUser(data) })
      .catch(console.error)
  }, [])

  // ปิด popup เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsPopupOpen(false)
      }
    }
    if (isPopupOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isPopupOpen])

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

      {/* ── User Card ── */}
      <div className="px-2.5 mt-auto pt-4 border-t border-[#D9D2C7]" ref={popupRef}>

        {/* Popup Modal */}
        {isPopupOpen && (
          <div className="absolute left-[10px] bottom-[72px] w-[200px] bg-white border border-[#D9D2C7] rounded-xl shadow-lg overflow-hidden z-50">
            {/* ข้อมูล user ด้านบน */}
            <div className="px-4 py-3 border-b border-[#EDE8DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] rounded-full bg-[#C07B5A] flex items-center justify-center text-[13px] font-bold text-white shrink-0 overflow-hidden">
                  {user?.image
                    ? <img src={user.image} alt="User" className="w-full h-full object-cover" />
                    : user?.name ? user.name.charAt(0).toUpperCase() : "?"
                  }
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-[#5C4033] truncate">{user?.name || "..."}</div>
                  <div className="text-[10px] text-[#8B6F5E] truncate">{user?.email || "..."}</div>
                </div>
              </div>
            </div>

            {/* เมนู */}
            <div className="py-1">
              <button
                onClick={() => { setIsPopupOpen(false); router.push("/settings") }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#5C4033] hover:bg-[#FAF9F6] transition-colors"
              >
                <UserPen size={14} strokeWidth={1.8} />
                แก้ไขโปรไฟล์
              </button>
              <button
                onClick={() => { setIsPopupOpen(false); signOut({ callbackUrl: "/login" }) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#C07B5A] hover:bg-[#FFF5F0] transition-colors"
              >
                <LogOut size={14} strokeWidth={1.8} />
                ออกจากระบบ
              </button>
            </div>
          </div>
        )}

        {/* ปุ่ม User */}
        <button
          onClick={() => setIsPopupOpen((prev) => !prev)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-[#5C4033]/10 text-left outline-none"
        >
          <div className="w-[30px] h-[30px] rounded-full bg-[#C07B5A] flex items-center justify-center text-[12px] font-bold text-white shrink-0 overflow-hidden shadow-sm">
            {user?.image
              ? <img src={user.image} alt="User" className="w-full h-full object-cover" />
              : user?.name ? user.name.charAt(0).toUpperCase() : "?"
            }
          </div>
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
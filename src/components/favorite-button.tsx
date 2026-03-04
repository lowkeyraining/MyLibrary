"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { toggleFavorite } from "@/actions/book"
import { useRouter } from "next/navigation"

export function FavoriteButton({ bookId, initialFavorite }: { bookId: string, initialFavorite: boolean }) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoading) return

    setIsLoading(true)
    setIsFavorite(!isFavorite)

    const result = await toggleFavorite(bookId, isFavorite)
    
    if (!result.success) {
      setIsFavorite(isFavorite)
      alert("เกิดข้อผิดพลาด ไม่สามารถอัปเดตสถานะได้")
    } else {
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isLoading}
      className="bg-white/80 p-1.5 rounded-full backdrop-blur-sm hover:scale-110 transition-transform shadow-sm outline-none cursor-pointer"
      title={isFavorite ? "เลิกเป็นเล่มโปรด" : "เพิ่มเป็นเล่มโปรด"}
    >
      <Heart 
        className={`w-5 h-5 transition-colors ${
          isFavorite ? "text-[#ff0000] fill-[#ff0000af]" : "text-[#817873d0]"
        }`} 
      />
    </button>
  )
}
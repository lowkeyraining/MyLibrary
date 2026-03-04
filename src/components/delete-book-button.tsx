"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteBooks } from "@/actions/book"

export function DeleteBookButton({ bookId }: { bookId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = confirm("แน่ใจใช่มั้ยว่าจะลบหนังสือเล่มนี้?\nการลบจะไม่สามารถกู้คืนได้")
    if (!confirmed) return
    setIsDeleting(true)
    const result = await deleteBooks([bookId])
    if (result.success) {
      router.push("/books")
      router.refresh()
    } else {
      alert("เกิดข้อผิดพลาดในการลบหนังสือ")
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#D9D2C7] bg-white text-[#8B6F5E] hover:border-red-400 hover:text-red-400 disabled:opacity-50 transition-colors"
      title="ลบหนังสือ"
    >
      {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  )
}
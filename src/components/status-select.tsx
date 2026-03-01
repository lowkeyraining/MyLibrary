"use client"

import { useTransition } from "react"
import { updateBookStatus } from "@/actions/book"

export function StatusSelect({ bookId, currentStatus }: { bookId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    
    startTransition(async () => {
      const result = await updateBookStatus(bookId, newStatus)
      if (!result.success) {
        alert("เกิดข้อผิดพลาด ไม่สามารถอัปเดตสถานะได้")
      }
    })
  }

  return (
    <select 
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="w-full bg-white border border-[#D9D2C7] rounded-lg py-2.5 px-3 text-[13px] text-[#5C4033] outline-none focus:border-[#C07B5A] cursor-pointer disabled:opacity-50 transition-opacity"
    >
      <option value="READING">Reading (กำลังอ่าน)</option>
      <option value="WANT_TO_READ">Want to Read (อยากอ่าน)</option>
      <option value="COMPLETED">Completed (อ่านจบแล้ว)</option>
      <option value="DROPPED">Dropped (เท/เลิกอ่าน)</option>
    </select>
  )
}
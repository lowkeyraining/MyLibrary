"use client"

import { useState, useTransition, useEffect } from "react"  // ✅ เพิ่ม useEffect
import { updateBookStatus } from "@/actions/book"

export function StatusSelect({ bookId, currentStatus }: { bookId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(currentStatus)

  // ✅ sync เมื่อ prop เปลี่ยน (หลัง router.refresh())
  useEffect(() => {
    setStatus(currentStatus)
  }, [currentStatus])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)

    startTransition(async () => {
      const result = await updateBookStatus(bookId, newStatus)
      if (!result.success) {
        alert("เกิดข้อผิดพลาด ไม่สามารถอัปเดตสถานะได้")
        setStatus(currentStatus)
      }
    })
  }

  return (
    <select
      value={status}
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
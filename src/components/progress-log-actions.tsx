"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProgressLog, deleteProgressLog } from "@/actions/book"
import { Pencil, Trash2, X, Save, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ProgressLogActionsProps {
  logId: string
  currentPage: number
  note: string | null
  totalPages: number
}

export function ProgressLogActions({ logId, currentPage, note, totalPages }: ProgressLogActionsProps) {
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [page, setPage] = useState(currentPage)
  const [noteVal, setNoteVal] = useState(note || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = async () => {
    setIsLoading(true)
    const result = await updateProgressLog(logId, page, noteVal || null)
    if (result.success) {
      setIsEditOpen(false)
      router.refresh()
    } else {
      alert("เกิดข้อผิดพลาด")
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("ลบรายการนี้?")) return
    setIsDeleting(true)
    const result = await deleteProgressLog(logId)
    if (result.success) {
      router.refresh()
    } else {
      alert("เกิดข้อผิดพลาด")
    }
    setIsDeleting(false)
  }

  return (
    <>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => { setPage(currentPage); setNoteVal(note || ""); setIsEditOpen(true) }}
          className="p-1 rounded hover:bg-[#EDE8DF] text-[#8B6F5E] hover:text-[#5C4033] transition-colors"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1 rounded hover:bg-red-50 text-[#8B6F5E] hover:text-red-400 transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        </button>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[360px] p-0 bg-white border-none shadow-[0_24px_60px_rgba(92,64,51,0.18)] rounded-2xl overflow-hidden [&>button]:hidden">
          <div className="p-5 border-b border-[#D9D2C7] flex items-center justify-between">
            <DialogTitle className="text-[15px] font-bold text-[#5C4033]">Edit Progress Log</DialogTitle>
            <button
              onClick={() => setIsEditOpen(false)}
              className="w-[28px] h-[28px] rounded-full bg-[#EDE8DF] hover:bg-[#D9D2C7] flex items-center justify-center text-[#8B6F5E] transition-colors"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div>
              <label className="text-[12px] font-semibold text-[#5C4033] mb-1.5 block">หน้าที่</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={page || ""}
                  onChange={e => setPage(Math.min(parseInt(e.target.value) || 0, totalPages || 99999))}
                  min={0}
                  max={totalPages || undefined}
                  className="flex-1 bg-[#FAF9F6] border border-[#D9D2C7] rounded-lg py-2 px-3 text-[15px] font-semibold text-center text-[#5C4033] outline-none focus:border-[#C07B5A] transition-colors"
                />
                {totalPages > 0 && (
                  <span className="text-[13px] text-[#8B6F5E]">/ {totalPages}</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#5C4033] mb-1.5 block">
                Note <span className="text-[#8B6F5E] font-normal">(optional)</span>
              </label>
              <textarea
                value={noteVal}
                onChange={e => setNoteVal(e.target.value)}
                placeholder="บันทึกสั้นๆ..."
                className="w-full bg-[#FAF9F6] border border-[#D9D2C7] rounded-lg py-2.5 px-3 text-[13px] text-[#5C4033] outline-none focus:border-[#C07B5A] transition-colors resize-none h-[68px] placeholder:text-[#8B6F5E]/70"
              />
            </div>
          </div>

          <div className="px-5 py-4 border-t border-[#D9D2C7] flex justify-end gap-2">
            <button
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-[#8B6F5E] border border-[#D9D2C7] rounded-lg text-[13px] font-medium hover:text-[#5C4033] hover:border-[#C4A882] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="px-4 py-2 bg-[#5C4033] text-white rounded-lg text-[13px] font-semibold hover:bg-[#4A332A] transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
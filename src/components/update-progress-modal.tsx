"use client"

import { useState } from "react"
import { updateBookProgress } from "@/actions/book"
import { BookOpen, Loader2, X, Check, Save } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"

interface UpdateProgressModalProps {
  bookId: string
  title: string
  author: string
  totalPages: number
  initialPage: number
}

export function UpdateProgressModal({ bookId, title, author, totalPages, initialPage }: UpdateProgressModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState<number>(initialPage || 0)
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // คำนวณเปอร์เซ็นต์
  const pct = totalPages > 0 ? Math.min(100, Math.max(0, (page / totalPages) * 100)) : 0

  const handleSave = async () => {
    setIsLoading(true)
    const result = await updateBookProgress(bookId, page, note)
    
    if (result.success) {
      setIsOpen(false)
      setNote("") // เคลียร์ Note สำหรับรอบหน้า
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึก")
    }
    setIsLoading(false)
  }

  // ฟังก์ชันพิมพ์ตัวเลขหน้า
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0
    // บังคับไม่ให้กรอกเกินหน้าทั้งหมด (ถ้ามี totalPages)
    setPage(totalPages > 0 ? Math.min(val, totalPages) : Math.max(0, val))
  }

  // ฟังก์ชันบวกหน้าแบบด่วน
  const addPages = (n: number) => {
    setPage(prev => {
      const newVal = prev + n
      return totalPages > 0 ? Math.min(newVal, totalPages) : newVal
    })
  }

  // ฟังก์ชันกดอ่านจบ
  const setFinish = () => {
    if (totalPages > 0) setPage(totalPages)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* ปุ่มที่จะไปโชว์ในหน้า Detail */}
        <button className="w-full py-2.5 bg-[#5C4033] hover:bg-[#4A332A] text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center justify-center gap-2">
          <BookOpen size={14} /> Update Progress
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px] p-0 bg-white border-none shadow-[0_24px_60px_rgba(92,64,51,0.18)] rounded-2xl overflow-hidden [&>button]:hidden">
        
        {/* ── HEADER ── */}
        <div className="p-6 pb-5 border-b border-[#D9D2C7]">
           <div className="flex items-start justify-between">
             <div>
               <DialogTitle className="text-[16px] font-bold text-[#5C4033] mb-0.5">Update Progress</DialogTitle>
               <div className="text-[12px] text-[#8B6F5E]">{title} · {author}</div>
             </div>
             <button 
               onClick={() => setIsOpen(false)} 
               className="w-[30px] h-[30px] rounded-full bg-[#EDE8DF] hover:bg-[#D9D2C7] flex items-center justify-center text-[#8B6F5E] hover:text-[#5C4033] transition-colors shrink-0"
             >
               <X size={14} strokeWidth={2.5} />
             </button>
           </div>
        </div>

        {/* ── PROGRESS DISPLAY (แบบเลื่อนได้) ── */}
        <div className="px-6 py-5 border-b border-[#D9D2C7]">
           <div className="text-[11px] font-semibold tracking-[1px] uppercase text-[#8B6F5E] mb-2.5">Current Progress</div>
           
           {/* หลอด Progress Bar แบบลากได้ */}
           <div className="relative h-[10px] bg-[#EDE8DF] rounded-full mb-3 w-full group">
             
             {/* 1. แถบสีที่วิ่งตามเปอร์เซ็นต์ (เอา transition ออกเพื่อให้เลื่อนติดมือ) */}
             <div 
               className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#C07B5A] to-[#D08A6A] rounded-full pointer-events-none" 
               style={{ width: `${pct}%` }}
             >
               {/* จุดวงกลมปลายหลอด (Thumb) */}
               <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full bg-[#C07B5A] border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-transform group-hover:scale-110" />
             </div>

             {/* 2. Input Range แบบซ่อนตัว เพื่อรับการกดและลาก */}
             <input
               type="range"
               min={0}
               max={totalPages > 0 ? totalPages : 100}
               value={page}
               onChange={handlePageChange}
               disabled={totalPages <= 0}
               title={totalPages <= 0 ? "กรุณาตั้งค่าหน้าทั้งหมดก่อนเลื่อน" : "เลื่อนเพื่อเปลี่ยนหน้า"}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 disabled:cursor-not-allowed"
             />
           </div>
           
           <div className="flex justify-between items-center text-[12px]">
             <span className="text-[#5C4033] font-medium">หน้า {page} จาก {totalPages || '?'}</span>
             <span className="text-[14px] font-bold text-[#C07B5A]">{Math.round(pct)}%</span>
           </div>
        </div>

        {/* ── INPUT SECTION ── */}
        <div className="px-6 py-5">
           
           {/* กรอกเลขหน้า */}
           <div className="mb-4">
             <label className="text-[12px] font-semibold text-[#5C4033] mb-1.5 block">Current page</label>
             <div className="flex items-center gap-2">
               <input
                 type="number"
                 value={page || ""}
                 onChange={handlePageChange}
                 min={0}
                 max={totalPages || undefined}
                 className="flex-1 bg-[#FAF9F6] border border-[#D9D2C7] rounded-lg py-2.5 px-3.5 text-[16px] font-semibold text-center text-[#5C4033] outline-none focus:border-[#C07B5A] transition-colors"
               />
               <span className="text-[13px] text-[#8B6F5E]">/</span>
               <span className="text-[15px] font-semibold text-[#8B6F5E]">{totalPages || '?'}</span>
             </div>
           </div>

           {/* ปุ่มกดเพิ่มหน้าด่วน */}
           <div className="flex flex-wrap gap-1.5 mb-4">
             <span className="text-[11px] text-[#8B6F5E] self-center mr-0.5">เพิ่ม:</span>
             <button onClick={() => addPages(10)} className="px-2.5 py-1 bg-[#EDE8DF] border border-[#D9D2C7] rounded-md text-[11px] font-semibold text-[#8B6F5E] hover:border-[#C4A882] hover:text-[#5C4033] hover:bg-[#C4A882]/10 transition-colors">+10</button>
             <button onClick={() => addPages(25)} className="px-2.5 py-1 bg-[#EDE8DF] border border-[#D9D2C7] rounded-md text-[11px] font-semibold text-[#8B6F5E] hover:border-[#C4A882] hover:text-[#5C4033] hover:bg-[#C4A882]/10 transition-colors">+25</button>
             <button onClick={() => addPages(50)} className="px-2.5 py-1 bg-[#EDE8DF] border border-[#D9D2C7] rounded-md text-[11px] font-semibold text-[#8B6F5E] hover:border-[#C4A882] hover:text-[#5C4033] hover:bg-[#C4A882]/10 transition-colors">+50</button>
             <button onClick={setFinish} className="px-2.5 py-1 bg-[#EDE8DF] border border-[#D9D2C7] rounded-md text-[11px] font-semibold text-[#8B6F5E] hover:border-[#C4A882] hover:text-[#5C4033] hover:bg-[#C4A882]/10 transition-colors">จบแล้ว</button>
           </div>

           {/* กล่องข้อความแสดงความยินดี */}
           <div className={`flex items-center gap-2 text-[12px] text-[#9CAF88] font-medium transition-all duration-300 ${page >= totalPages && totalPages > 0 ? 'opacity-100 mb-4 h-auto' : 'opacity-0 h-0 overflow-hidden mb-0'}`}>
             <Check size={14} strokeWidth={2.5} />
             ยินดีด้วย! คุณอ่านครบแล้ว
           </div>

           {/* ช่องกรอก Note */}
           <div className="mt-1">
             <label className="text-[12px] font-semibold text-[#5C4033] mb-1.5 block">
               Note <span className="text-[#8B6F5E] font-normal">(optional)</span>
             </label>
             <textarea
               value={note}
               onChange={(e) => setNote(e.target.value)}
               placeholder="บันทึกสั้นๆ เช่น เนื้อหาที่ชอบ, ความรู้สึก..."
               className="w-full bg-[#FAF9F6] border border-[#D9D2C7] rounded-lg py-2.5 px-3.5 text-[13px] text-[#5C4033] outline-none focus:border-[#C07B5A] transition-colors resize-none h-[68px] placeholder:text-[#8B6F5E]/70 placeholder:text-[12px]"
             />
           </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-6 py-4 border-t border-[#D9D2C7] flex justify-end gap-2.5">
          <button 
            onClick={() => setIsOpen(false)} 
            className="px-4 py-2 bg-transparent text-[#8B6F5E] border border-[#D9D2C7] rounded-lg text-[13px] font-medium hover:text-[#5C4033] hover:border-[#C4A882] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isLoading} 
            className="px-5 py-2 bg-[#5C4033] text-white border-none rounded-lg text-[13px] font-semibold hover:bg-[#4A332A] transition-colors flex items-center gap-1.5"
          >
            {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {isLoading ? "Saving..." : "Save Progress"}
          </button>
        </div>
        
      </DialogContent>
    </Dialog>
  )
}
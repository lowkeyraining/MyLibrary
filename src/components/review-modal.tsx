"use client"

import { useState } from "react"
import { updateBookReview } from "@/actions/book"
import { Star, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReviewModalProps {
  bookId: string
  title: string
  author: string
  initialRating?: number
  initialContent?: string
}

export function ReviewModal({ bookId, title, author, initialRating = 0, initialContent = "" }: ReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0) // สำหรับทำเอฟเฟกต์ตอนชี้เมาส์
  const [content, setContent] = useState(initialContent)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (rating === 0) {
      alert("กรุณาให้คะแนนอย่างน้อย 1 ดาวครับ")
      return
    }
    
    setIsLoading(true)
    const result = await updateBookReview(bookId, rating, content)
    
    if (result.success) {
      setIsOpen(false)
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึก")
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* ปุ่มที่จะไปโชว์ในหน้า Detail */}
        <button className="w-full py-2 bg-transparent border border-dashed border-[#D9D2C7] hover:border-[#C4A882] hover:text-[#5C4033] text-[#8B6F5E] rounded-lg text-[12px] font-medium transition-colors">
          + {initialRating > 0 ? 'แก้ไข' : 'เพิ่ม'} Rating & Review
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-[#FAF9F6] border-[#D9D2C7]">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-bold text-[#5C4033] mb-1">Rating & Review</DialogTitle>
          <div className="text-[12px] text-[#8B6F5E] mb-2">{title} · {author}</div>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-2">
          
          {/* ระบบเลือกดาว (Star Rating) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#5C4033]">Rating</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={28} 
                    className={`transition-colors duration-150 ${
                      star <= (hoverRating || rating) 
                        ? "text-[#C07B5A] fill-[#C07B5A]" 
                        : "text-[#D9D2C7]"
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ช่องเขียนรีวิว */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#5C4033]">Review</label>
            <Textarea 
              placeholder="เขียน review ของคุณ..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-white border-[#D9D2C7] focus-visible:ring-[#C07B5A] resize-none h-[100px] text-[13px]" 
            />
          </div>

        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="border-[#D9D2C7] text-[#8B6F5E] hover:bg-[#EDE8DF]">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-[#5C4033] hover:bg-[#4A332A] text-white">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
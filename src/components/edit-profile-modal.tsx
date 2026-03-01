"use client"

import { useState } from "react"
import { updateProfile } from "@/actions/user"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditProfileModalProps {
  initialName: string
  initialUsername: string
}

export function EditProfileModal({ initialName, initialUsername }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(initialName)
  const [username, setUsername] = useState(initialUsername)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (!name.trim() || !username.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    setIsLoading(true)
    setError("")
    
    const result = await updateProfile({ name, username })
    
    if (result.success) {
      setIsOpen(false) // ปิด Modal ถ้าสำเร็จ
    } else {
      setError(result.error || "เกิดข้อผิดพลาดบางอย่าง")
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* ปุ่ม Edit Profile ที่จะเอาไปวางในหน้า Settings */}
        <button className="absolute top-[18px] right-[18px] text-[12px] text-[#C07B5A] font-medium px-2 py-1 rounded-md hover:bg-[#C07B5A]/10 transition-colors">
          Edit Profile
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-[#FAF9F6] border-[#D9D2C7]">
        <DialogHeader>
          <DialogTitle className="text-[#5C4033]">แก้ไขโปรไฟล์</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#5C4033]">ชื่อที่แสดง (Name)</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรอกชื่อของคุณ"
              className="bg-white border-[#D9D2C7] focus-visible:ring-[#C07B5A]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#5C4033]">ชื่อผู้ใช้ (Username)</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))} // ไม่ให้พิมพ์ช่องว่าง
              placeholder="ตั้งชื่อผู้ใช้ของคุณ"
              className="bg-white border-[#D9D2C7] focus-visible:ring-[#C07B5A]"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium mt-1">{error}</p>}
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="border-[#D9D2C7] text-[#8B6F5E] hover:bg-[#EDE8DF]"
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-[#5C4033] hover:bg-[#4A332A] text-white"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            บันทึกการเปลี่ยนแปลง
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState, useRef } from "react"
import { updateUserProfile, updateReadingGoal } from "@/actions/settings"
import { uploadProfileImage } from "@/actions/upload"
import { Loader2, Save, Upload, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { signOut } from "next-auth/react"

// ── 1. ป๊อปอัปแก้ไขโปรไฟล์ (Edit Profile Modal) ──
export function EditProfileModal({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [image, setImage] = useState(user?.image || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const MAX_WIDTH = 150
          const MAX_HEIGHT = 150
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width; canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)

          const dataUrl = canvas.toDataURL("image/jpeg", 0.5)
          setImage(dataUrl)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setError("")

    if (password) {
      if (!currentPassword) {
        setError("กรุณากรอกรหัสผ่านเดิมก่อน")
        return
      }
      if (password.length < 8) {
        setError("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร")
        return
      }
      if (password !== confirmPassword) {
        setError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน")
        return
      }
    }

    setIsLoading(true); setIsSuccess(false)

    let imageUrl = image
    if (image.startsWith("data:image")) {
      const uploadRes = await uploadProfileImage(image)
      if (!uploadRes.success) {
        alert("อัพโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง")
        setIsLoading(false)
        return
      }
      imageUrl = uploadRes.url!
    }

    const res = await updateUserProfile(name, email, password, imageUrl, currentPassword)
    if (res.success) {
      setIsSuccess(true)
      setPassword("")
      setConfirmPassword("")
      setCurrentPassword("")
      setTimeout(() => { setIsSuccess(false); setIsOpen(false) }, 1500)
    } else {
      setError(res.error || "เกิดข้อผิดพลาดในการบันทึกโปรไฟล์")
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        setCurrentPassword("")
        setPassword("")
        setConfirmPassword("")
        setError("")
      }
    }}>
      <DialogTrigger asChild>
        <button className="absolute top-[18px] right-[18px] text-[12px] text-[#C07B5A] font-semibold bg-[#C07B5A]/10 border border-[#C07B5A]/20 px-3 py-1.5 rounded-md hover:bg-[#C07B5A]/20 transition-colors cursor-pointer outline-none">
          Edit Profile
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-[#FAF9F6] border-[#D9D2C7] p-6 rounded-2xl">
        <DialogTitle className="text-[18px] font-bold text-[#5C4033] mb-2">Edit Profile</DialogTitle>
        <div className="flex flex-col gap-5 mt-2">
          <div className="flex items-center gap-4">
            <div className="w-[64px] h-[64px] rounded-full bg-[#EDE8DF] border border-[#D9D2C7] flex items-center justify-center overflow-hidden shrink-0">
              {image
                ? <img src={image} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-[24px] font-bold text-[#8B6F5E]">{name ? name.charAt(0).toUpperCase() : "?"}</span>
              }
            </div>
            <div>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-[#D9D2C7] text-[#8B6F5E] text-[12px] font-medium rounded-lg hover:border-[#C4A882] hover:text-[#5C4033] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Upload size={14} /> อัพโหลดรูปโปรไฟล์
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <div>
              <label className="text-[12px] font-semibold text-[#5C4033] mb-1.5 block">ชื่อ - นามสกุล</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#D9D2C7] rounded-lg py-2 px-3 text-[13px] text-[#5C4033] outline-none focus:border-[#C07B5A]" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#5C4033] mb-1.5 block">อีเมล</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#D9D2C7] rounded-lg py-2 px-3 text-[13px] text-[#5C4033] outline-none focus:border-[#C07B5A]" />
            </div>

            {/* Password Section */}
            <div className="border-t border-[#D9D2C7] pt-3">
              <p className="text-[11px] text-[#8B6F5E] mb-3">เปลี่ยนรหัสผ่าน (เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)</p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-[#5C4033] mb-1.5 block">รหัสผ่านเดิม</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white border border-[#D9D2C7] rounded-lg py-2 px-3 text-[13px] text-[#5C4033] outline-none focus:border-[#C07B5A]"
                    placeholder="กรอกรหัสผ่านเดิม" />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#5C4033] mb-1.5 block">รหัสผ่านใหม่</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#D9D2C7] rounded-lg py-2 px-3 text-[13px] text-[#5C4033] outline-none focus:border-[#C07B5A]"
                    placeholder="อย่างน้อย 8 ตัวอักษร" />
                  {password && password.length < 8 && (
                    <p className="text-[11px] text-red-500 mt-1">รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร</p>
                  )}
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#5C4033] mb-1.5 block">ยืนยันรหัสผ่านใหม่</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-white border rounded-lg py-2 px-3 text-[13px] text-[#5C4033] outline-none focus:border-[#C07B5A] ${
                      confirmPassword && password !== confirmPassword ? "border-red-400" :
                      confirmPassword && password === confirmPassword ? "border-green-400" :
                      "border-[#D9D2C7]"
                    }`}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง" />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1">รหัสผ่านไม่ตรงกัน</p>
                  )}
                  {confirmPassword && password === confirmPassword && password.length >= 8 && (
                    <p className="text-[11px] text-green-600 mt-1">รหัสผ่านตรงกัน ✓</p>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="text-[12px] text-red-500 font-medium">{error}</p>}
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-5 py-2 text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2 ${isSuccess ? "bg-[#9CAF88]" : "bg-[#5C4033] hover:bg-[#4A332A]"}`}
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : isSuccess ? <CheckCircle2 size={14} /> : <Save size={14} />}
              {isSuccess ? "บันทึกสำเร็จ!" : "บันทึกโปรไฟล์"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── 2. ป๊อปอัปตั้งเป้าหมาย (Goal Modal) ──
export function GoalModal({ initialTarget, children }: { initialTarget: number, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [target, setTarget] = useState(initialTarget || 12)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSave = async () => {
    setIsLoading(true); setIsSuccess(false)
    const res = await updateReadingGoal(target)
    if (res.success) {
      setIsSuccess(true); setTimeout(() => { setIsSuccess(false); setIsOpen(false) }, 1500)
    } else { alert("เกิดข้อผิดพลาดในการบันทึกเป้าหมาย") }
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-[#FAF9F6] border-[#D9D2C7] p-6 rounded-2xl">
        <DialogTitle className="text-[18px] font-bold text-[#5C4033] mb-1">Goal Management</DialogTitle>
        <p className="text-[13px] text-[#8B6F5E] mb-4">ตั้งเป้าหมายจำนวนหนังสือที่คุณอยากอ่านให้จบภายในปีนี้</p>
        <div className="flex items-center gap-3 mb-4 mt-2">
          <input
            type="number"
            value={target || ""}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
            min={1}
            className="w-[120px] bg-white border border-[#D9D2C7] rounded-lg py-2.5 px-3 text-[18px] font-bold text-[#C07B5A] text-center outline-none focus:border-[#C07B5A]"
          />
          <span className="text-[14px] text-[#8B6F5E] font-medium">เล่ม / ปี</span>
        </div>
        <div className="flex justify-end pt-3">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-5 py-2 text-white rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2 ${isSuccess ? "bg-[#9CAF88]" : "bg-[#C07B5A] hover:bg-[#A66648]"}`}
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : isSuccess ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {isSuccess ? "อัปเดตสำเร็จ!" : "บันทึกเป้าหมาย"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── 3. ปุ่มออกจากระบบ (Logout Button) ──
export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full bg-white border border-[#D9D2C7] rounded-[10px] p-[16px_18px] flex items-center gap-3 cursor-pointer transition-all hover:border-[#C07B5A]/40 hover:bg-[#C07B5A]/5 mt-4 group"
    >
      <svg className="text-[#C07B5A] group-hover:scale-110 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      <span className="text-[14px] font-semibold text-[#C07B5A]">ออกจากระบบ</span>
    </button>
  )
}
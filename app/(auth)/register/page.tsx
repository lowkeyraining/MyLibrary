// app/(auth)/register/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/actions/register" // ตรวจสอบว่ามีไฟล์ actions/register.ts แล้ว

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await register(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // สมัครสำเร็จ -> ไป Login
      router.push("/login")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tab Switcher */}
      <div className="flex gap-8 border-b border-[#D9D2C7] mb-8">
        <Link 
          href="/login" 
          className="pb-2 border-b-2 border-transparent text-[#8B6F5E] hover:text-[#5C4033] transition-colors"
        >
          Sign In
        </Link>
        <div className="pb-2 border-b-2 border-[#5C4033] text-[#5C4033] font-medium cursor-default">
          Create Account
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#5C4033]">Create account</h2>
        <p className="text-[#8B6F5E] text-sm">เริ่มติดตามการอ่านของคุณวันนี้</p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="firstname" className="text-[#5C4033]">First name</Label>
                <Input id="firstname" name="username" placeholder="ชื่อ" className="rounded-lg border-[#D9D2C7] bg-white" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastname" className="text-[#5C4033]">Last name</Label>
                <Input id="lastname" name="lastname" placeholder="นามสกุล" className="rounded-lg border-[#D9D2C7] bg-white" />
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#5C4033]">Email</Label>
          <Input id="email" name="email" type="email" placeholder="your@email.com" className="rounded-lg border-[#D9D2C7] bg-white" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#5C4033]">Password</Label>
          <Input id="password" name="password" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" className="rounded-lg border-[#D9D2C7] bg-white" required />
        </div>

        {error && <p className="text-[#C4887A] text-sm bg-red-50 p-2 rounded">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full bg-[#5C4033] hover:bg-[#4A332A] text-white rounded-lg h-11 font-medium mt-4">
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center text-sm text-[#8B6F5E]">
        มีบัญชีอยู่แล้ว? <Link href="/login" className="text-[#C07B5A] hover:underline font-medium">เข้าสู่ระบบ</Link>
      </div>
    </div>
  )
}
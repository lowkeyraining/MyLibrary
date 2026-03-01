"use client"
import { signIn } from "next-auth/react" // ← client-side signIn
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/actions/register"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const res = await register(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
      return
    }

    // สำเร็จ → signIn ด้วย next-auth/react (client-side)
    const result = await signIn("credentials", {
      identifier: formData.get("email"),
      password: formData.get("password"),
      redirect: false, // จัดการ redirect เอง
    })

    if (result?.error) {
      setError("เข้าสู่ระบบไม่สำเร็จ")
      setLoading(false)
      return
    }

    window.location.href = "/onboarding"
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-8 border-b border-[#D9D2C7] mb-8">
        <Link href="/login" className="pb-2 text-[#8B6F5E] hover:text-[#5C4033] transition-colors">Sign In</Link>
        <div className="pb-2 border-b-2 border-[#5C4033] text-[#5C4033] font-medium cursor-default">Create Account</div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#5C4033]">Create account</h2>
        <p className="text-[#8B6F5E] text-sm font-ibm">เริ่มติดตามการอ่านของคุณวันนี้</p>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-ibm">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First name</Label>
            <Input name="firstname" placeholder="ชื่อ" className="rounded-lg h-11 bg-white border-[#D9D2C7]" required />
          </div>
          <div className="space-y-2">
            <Label>Last name</Label>
            <Input name="lastname" placeholder="นามสกุล" className="rounded-lg h-11 bg-white border-[#D9D2C7]" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Username</Label>
          <Input name="username" placeholder="เช่น reader_jane" className="rounded-lg h-11 bg-white border-[#D9D2C7]" required />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input name="email" type="email" placeholder="your@email.com" className="rounded-lg h-11 bg-white border-[#D9D2C7]" required />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input name="password" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" className="rounded-lg h-11 bg-white border-[#D9D2C7]" required />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5C4033] hover:bg-[#4A332A] h-11 mt-4 text-white rounded-lg disabled:opacity-60"
        >
          {loading ? "กำลังสร้างบัญชี..." : "Create Account"}
        </Button>
      </form>
    </div>
  )
}
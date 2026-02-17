// app/(auth)/login/page.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      })

      if (result?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        setLoading(false)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tab Switcher */}
      <div className="flex gap-8 border-b border-[#D9D2C7] mb-8">
        <div className="pb-2 border-b-2 border-[#5C4033] text-[#5C4033] font-medium cursor-default">
          Sign In
        </div>
        <Link 
          href="/register" 
          className="pb-2 border-b-2 border-transparent text-[#8B6F5E] hover:text-[#5C4033] transition-colors"
        >
          Create Account
        </Link>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#5C4033]">Welcome back</h2>
        <p className="text-[#8B6F5E] text-sm">ยินดีต้อนรับกลับมา เข้าสู่คลังหนังสือของคุณ</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#5C4033]">Email</Label>
          <Input 
            id="email" name="email" type="email" placeholder="your@email.com" 
            className="rounded-lg border-[#D9D2C7] focus:border-[#C07B5A] focus:ring-[#C07B5A] bg-white" 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-[#5C4033]">Password</Label>
            <Link href="#" className="text-xs text-[#C07B5A] hover:underline">Forgot password?</Link>
          </div>
          <Input 
            id="password" name="password" type="password" placeholder="••••••••" 
            className="rounded-lg border-[#D9D2C7] focus:border-[#C07B5A] focus:ring-[#C07B5A] bg-white" 
            required 
          />
        </div>

        {error && <p className="text-[#C4887A] text-sm bg-red-50 p-2 rounded">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full bg-[#5C4033] hover:bg-[#4A332A] text-white rounded-lg h-11 font-medium mt-4">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-sm text-[#8B6F5E]">
        ยังไม่มีบัญชี? <Link href="/register" className="text-[#C07B5A] hover:underline font-medium">สมัครสมาชิก</Link>
      </div>
    </div>
  )
}
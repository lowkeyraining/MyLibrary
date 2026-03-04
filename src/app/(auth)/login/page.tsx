"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      identifier: formData.get("identifier"),
      password: formData.get("password"),
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Username/Email หรือ Password ไม่ถูกต้อง")
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-8 border-b border-[#D9D2C7] mb-8">
        <div className="pb-2 border-b-2 border-[#5C4033] text-[#5C4033] font-medium cursor-default">Sign In</div>
        <Link href="/register" className="pb-2 text-[#8B6F5E] hover:text-[#5C4033] transition-colors">Create Account</Link>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#5C4033]">Welcome back</h2>
        <p className="text-[#8B6F5E] text-sm font-ibm">ยินดีต้อนรับกลับเข้าสู่คลังหนังสือของคุณ</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 font-ibm">
        <div className="space-y-2">
          <Label>Username or Email</Label>
          <Input
            name="identifier"
            placeholder="username หรือ your@email.com"
            className="rounded-lg h-11 bg-white border-[#D9D2C7]"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <Label>Password</Label>
          </div>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            className="rounded-lg h-11 bg-white border-[#D9D2C7]"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5C4033] hover:bg-[#4A332A] h-11 mt-4 text-white rounded-lg disabled:opacity-60"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "Sign In"}
        </Button>
      </form>
    </div>
  )
}
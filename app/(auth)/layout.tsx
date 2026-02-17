// app/(auth)/layout.tsx
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ฝั่งซ้าย - พื้นหลังสีฟ้า + Quote */}
      <div className="hidden lg:flex flex-col justify-between bg-[#D4E5EF] p-12 relative overflow-hidden">
        {/* Logo */}
        <div className="z-10">
          <h1 className="text-2xl font-bold tracking-tight text-[#5C4033]">My Library</h1>
          <p className="text-xs tracking-[2px] text-[#8B6F5E] uppercase mt-1">Reading Tracker</p>
        </div>

        {/* Quote */}
        <div className="z-10 max-w-md">
          <blockquote className="text-2xl font-light text-[#5C4033] leading-relaxed">
            &quot;A reader lives a thousand lives before he dies. The man who never reads lives <span className="italic text-[#C07B5A]">only one</span>.&quot;
          </blockquote>
          <p className="mt-4 text-[#8B6F5E]">— George R.R. Martin</p>
        </div>

        {/* Stats */}
        <div className="z-10 flex gap-12">
          <div>
            <p className="text-3xl font-bold text-[#5C4033]">2,847</p>
            <p className="text-xs text-[#8B6F5E] mt-1">Books tracked</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#5C4033]">312</p>
            <p className="text-xs text-[#8B6F5E] mt-1">Readers</p>
          </div>
        </div>
      </div>

      {/* ฝั่งขวา - พื้นที่สำหรับ Form Login/Register */}
      <div className="flex items-center justify-center p-8 bg-[#FAF9F6]">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  )
}
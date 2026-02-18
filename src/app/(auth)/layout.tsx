// app/(auth)/layout.tsx
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // เปลี่ยนจาก grid เป็น flex เพื่อให้ทำ animation ยืดขยายได้เนียนขึ้น
    <div className="w-full min-h-screen flex flex-col lg:flex-row overflow-x-hidden bg-[#FAF9F6]">

      {/* ฝั่งซ้าย - พื้นหลังสีฟ้า*/}
      <div
        className="
          hidden lg:flex
          flex-col justify-center items-center
          text-center
          bg-[#D4E5EF]
          p-8 
          relative overflow-hidden
          transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          lg:w-[28%]
          hover:lg:w-[45%]
          group
          z-20
          shadow-xl
        "
      >
        {/* รวม Content ไว้ใน div เดียวเพื่อจัดกลุ่มกลางจอ */}
        {/* เพิ่ม transition ให้ตัวหนังสือขยายและชัดขึ้นเล็กน้อยตอน hover */}
        <div className="z-10 flex flex-col gap-12 max-w-[320px] transition-all duration-800 delay-100 group-hover:scale-105 group-hover:max-w-md">
          {/* Logo */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#5C4033]">My Library</h1>
            <p className="text-xs tracking-[3px] text-[#8B6F5E] uppercase mt-2 font-medium">Reading Tracker</p>
          </div>

          {/* Quote */}
          <div>
            <blockquote className="text-2xl font-light text-[#5C4033] leading-relaxed italic">
              &quot;A reader lives a thousand lives before he dies...&quot;
            </blockquote>
            <p className="mt-6 text-[#8B6F5E] font-medium">— George R.R. Martin</p>
          </div>

          {/* Stats (ปรับให้เล็กลงหน่อยเพื่อให้เข้ากับพื้นที่แคบ) */}
          <div className="flex gap-8 justify-center pt-4 border-t border-[#5C4033]/10">
            <div>
              <p className="text-2xl font-bold text-[#5C4033]">2,847</p>
              <p className="text-[10px] text-[#8B6F5E] uppercase tracking-wider mt-1">Books</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#5C4033]">312</p>
              <p className="text-[10px] text-[#8B6F5E] uppercase tracking-wider mt-1">Readers</p>
            </div>
          </div>
        </div>

        {/* Background Overlay (ทำให้สว่างขึ้นตอน hover) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none transition-opacity duration-800 opacity-50 group-hover:opacity-100" />
      </div>

      {/* ฝั่งขวา - พื้นที่สำหรับ Form */}
      {/* ใช้ flex-1 เพื่อให้ยืดหดตามพื้นที่ที่เหลือโดยอัตโนมัติ */}
      <div className="flex flex-1 items-center justify-center p-8 transition-all duration-800 z-10 relative">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  )
}
// app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row overflow-x-hidden bg-[#FAF9F6]">

      {/* ฝั่งซ้าย */}
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
        <div className="z-10 flex flex-col gap-12 max-w-[320px] transition-all duration-[800ms] delay-100 group-hover:scale-105 group-hover:max-w-md">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#5C4033]">My Library</h1>
            <p className="text-xs tracking-[3px] text-[#8B6F5E] uppercase mt-2 font-medium">Reading Tracker</p>
          </div>

          <div>
            <blockquote className="text-2xl font-light text-[#5C4033] leading-relaxed italic">
              &quot;A reader lives a thousand lives before he dies. The man who never reads lives only one&quot;
            </blockquote>
            <p className="mt-6 text-[#8B6F5E] font-medium">— George R.R. Martin</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none transition-opacity duration-[800ms] opacity-50 group-hover:opacity-100" />
      </div>

      {/* ฝั่งขวา */}
      <div className="flex flex-1 items-center justify-center p-8 transition-all duration-[800ms] z-10 relative">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  )
}
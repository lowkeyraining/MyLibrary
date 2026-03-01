import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { EditProfileModal, GoalModal, LogoutButton } from "@/components/settings-client"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  const currentYear = new Date().getFullYear()
  const goal = await prisma.readingGoal.findFirst({
    where: { userId: session.user.id, period: "YEARLY", year: currentYear }
  })

  if (!user) return null

  return (
    <div className="max-w-[680px] w-full mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4">
      
      {/* ── HEADER ── */}
      <h1 className="text-[26px] font-bold tracking-tight text-[#5C4033] mb-1">Settings</h1>
      <p className="text-[13px] text-[#8B6F5E] mb-7">บัญชีและการตั้งค่า</p>

      {/* ── PROFILE CARD ── */}
      <div className="bg-white border border-[#D9D2C7] rounded-[12px] p-6 flex items-center gap-[18px] mb-3 relative shadow-sm">
        
        {/* ปุ่ม Edit Profile ที่จะเปิดป๊อปอัป */}
        <EditProfileModal user={user}>
          <button className="absolute top-[18px] right-[18px] text-[12px] text-[#C07B5A] font-medium cursor-pointer bg-transparent border-none px-2 py-1 rounded-md transition-colors hover:bg-[#C07B5A]/10 outline-none">
            Edit Profile
          </button>
        </EditProfileModal>
        
        <div className="w-[64px] h-[64px] rounded-full bg-[#C07B5A] flex items-center justify-center text-[22px] font-bold text-white shrink-0 overflow-hidden shadow-inner">
           {user.image ? (
             <img src={user.image} alt={user.name || "Profile"} className="w-full h-full object-cover" />
           ) : (
             user.name?.charAt(0).toUpperCase() || "?"
           )}
        </div>
        
        <div className="flex-1">
          <div className="text-[18px] font-bold text-[#5C4033] mb-[3px]">{user.name}</div>
          <div className="text-[13px] text-[#8B6F5E] mb-[2px]">@{user.username || 'user'}</div>
          <div className="text-[12px] text-[#8B6F5E]">{user.email}</div>
        </div>
      </div>

      {/* ── MENU ITEMS ── */}
      <div className="flex flex-col gap-2 mb-4">
         
         {/* เมนู Goal Management ที่จะเปิดป๊อปอัป */}
         <GoalModal initialTarget={goal?.targetBooks || 0}>
            <div className="bg-white border border-[#D9D2C7] rounded-[10px] p-[16px_18px] flex items-center justify-between cursor-pointer transition-all hover:border-[#C4A882] hover:bg-[#EDE8DF]/30 shadow-sm">
              <div className="flex items-center gap-[14px]">
                 <div className="w-[36px] h-[36px] rounded-lg bg-[#EDE8DF] flex items-center justify-center text-[#8B6F5E] shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                 </div>
                 <div>
                    <div className="text-[14px] font-semibold text-[#5C4033] mb-[2px]">Goal Management</div>
                    <div className="text-[12px] text-[#8B6F5E]">เป้าหมายการอ่านประจำปี — ปัจจุบัน {goal?.targetBooks || 0} เล่ม / ปี</div>
                 </div>
              </div>
              <svg className="text-[#8B6F5E]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
         </GoalModal>
         
         {/* เมนูติดต่อเรา (ลอยไว้ก่อน ยังไม่ได้ต่อลิงก์) */}
         <a href="#" className="bg-white border border-[#D9D2C7] rounded-[10px] p-[16px_18px] flex items-center justify-between cursor-pointer transition-all hover:border-[#C4A882] hover:bg-[#EDE8DF]/30 no-underline shadow-sm">
            <div className="flex items-center gap-[14px]">
               <div className="w-[36px] h-[36px] rounded-lg bg-[#EDE8DF] flex items-center justify-center text-[#8B6F5E] shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
               </div>
               <div>
                  <div className="text-[14px] font-semibold text-[#5C4033] mb-[2px]">ติดต่อเรา</div>
                  <div className="text-[12px] text-[#8B6F5E]">ส่งข้อเสนอแนะหรือรายงานปัญหา</div>
               </div>
            </div>
            <svg className="text-[#8B6F5E]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
         </a>

      </div>

      {/* ── LOGOUT BUTTON ── */}
      <LogoutButton />

    </div>
  )
}
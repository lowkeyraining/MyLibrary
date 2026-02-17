import AddBookModal from "@/components/add-book-modal"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { BookOpen, CheckCircle, Clock, BookMarked } from "lucide-react"
import { GoalCard } from "@/components/dashboard/goal-card"
import { TrendChart } from "@/components/dashboard/trend-chart" // อย่าลืมสร้างไฟล์นี้ก่อนนะ!

const prisma = new PrismaClient()

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id

  const [user, totalBooks, completed, reading, wantToRead, recentBooks] = await Promise.all([

    prisma.user.findUnique({ 
      where: { id: userId },
      include: { goals: true } 
    }),
    prisma.book.count({ where: { userId: userId } }),
    prisma.book.count({ where: { userId: userId, status: "COMPLETED" } }),
    prisma.book.count({ where: { userId: userId, status: "READING" } }),
    prisma.book.count({ where: { userId: userId, status: "WANT_TO_READ" } }),
    prisma.book.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    })
  ])

  const today = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const userGoal = user?.goals && user.goals.length > 0 ? user.goals[0].targetBooks : 24

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 fade-in">
      
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#5C4033]">
            {getGreeting()}, {user?.name?.split(' ')[0] || "User"}
          </h1>
          <p className="text-[#8B6F5E] mt-1 text-sm font-medium">
            {today} · กำลังอ่านอยู่ {reading} เล่ม
          </p>
        </div>
        
        <AddBookModal />
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Books" value={totalBooks} icon={BookOpen} color="text-[#5C4033]" />
        <StatCard label="Completed" value={completed} icon={CheckCircle} color="text-[#9CAF88]" sub="this year" />
        <StatCard label="Reading" value={reading} icon={Clock} color="text-[#C07B5A]" />
        <StatCard label="Want to Read" value={wantToRead} icon={BookMarked} color="text-[#A89CC8]" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5">
          <GoalCard 
            year={2026} 
            target={userGoal} 
            completed={completed} 
          />
        </div>

        <div className="lg:col-span-7">
           <TrendChart />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F5E]">Currently Reading</h3>
          <a href="/books?status=reading" className="text-xs text-[#C07B5A] hover:underline">View all →</a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
            <div className="w-[150px] h-[220px] bg-white border border-[#D9D2C7] rounded-xl flex items-center justify-center text-xs text-[#8B6F5E]">
                Placeholder (Book List)
            </div>
        </div>
      </div>

    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, sub }: any) {
  return (
    <div className="bg-white border border-[#D9D2C7] rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:border-[#C4A882] transition-colors cursor-default">
      <div className={`p-2 rounded-full bg-opacity-10 mb-2 ${color.replace('text', 'bg')}`}>
        <Icon size={20} className={color} />
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[#8B6F5E] font-medium mb-1">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-[#9CAF88] mt-1 font-medium">{sub}</div>}
    </div>
  )
}
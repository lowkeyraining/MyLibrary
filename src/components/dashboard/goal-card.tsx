"use client"

import Link from "next/link"

interface GoalCardProps {
  year: number
  target: number
  completed: number
}

export function GoalCard({ year, target, completed }: GoalCardProps) {
  // คำนวณเปอร์เซ็นต์
  const percent = Math.min(100, Math.round((completed / target) * 100))
  
  // สูตรคำนวณเส้นรอบวง (Radius 42)
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  // คำนวณเป้าหมายรายเดือน (Monthly Pace)
  const currentMonth = new Date().getMonth() + 1 // 1-12
  const remainingBooks = target - completed
  const remainingMonths = 12 - currentMonth + 1
  const monthlyPace = remainingBooks > 0 ? Math.ceil(remainingBooks / remainingMonths) : 0

  return (
    <div className="bg-white border border-[#D9D2C7] rounded-2xl p-6 h-[320px] shadow-sm flex flex-col relative overflow-hidden group">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F5E]">Reading Goal {year}</h3>
        <Link href="/settings" className="text-xs font-medium text-[#C07B5A] hover:underline">Edit</Link>
      </div>

      <div className="flex items-center gap-6 h-full pb-4 z-10">
        {/* วงกลม Progress */}
        <div className="relative w-[110px] h-[110px] flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* พื้นหลังวงกลม */}
            <circle
              cx="55" cy="55" r={radius}
              fill="none"
              stroke="#EDE8DF"
              strokeWidth="8"
            />
            {/* เส้น Progress สีส้ม */}
            <circle
              cx="55" cy="55" r={radius}
              fill="none"
              stroke="#C07B5A"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#5C4033]">{completed}</span>
            <span className="text-[10px] text-[#8B6F5E] uppercase">of {target}</span>
          </div>
        </div>

        {/* ข้อมูลด้านขวา */}
        <div className="flex-1">
          <div className="text-lg font-bold text-[#5C4033] mb-1">{percent}% Complete</div>
          <div className="text-xs text-[#8B6F5E] leading-relaxed mb-4">
            You@apos;ve read <span className="text-[#C07B5A] font-semibold">{completed} books</span>.
            <br />
            {remainingBooks > 0 
              ? `Keep going! ${remainingBooks} more to reach your goal.` 
              : "Goal achieved! 🎉 You're amazing!"}
          </div>

          {/* Monthly Pace Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#8B6F5E]">Monthly Pace</span>
              <span className="font-bold text-[#5C4033]">{monthlyPace} / month</span>
            </div>
            <div className="h-1.5 w-full bg-[#EDE8DF] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#C07B5A] rounded-full" 
                style={{ width: `${Math.min(100, (monthlyPace / (target/12)) * 100)}%` }} 
              />
            </div>
            <p className="text-[9px] text-[#8B6F5E]/70">Based on remaining months</p>
          </div>
        </div>
      </div>
    </div>
  )
}
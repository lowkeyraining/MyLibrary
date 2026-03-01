"use client"

import { useState } from "react"
import { updateReadingGoal } from "@/actions/goal"
import { Target } from "lucide-react"
import Link from "next/link"

interface GoalCardProps {
  year: number
  target: number | null
  completed: number
}

export function GoalCard({ year, target, completed }: GoalCardProps) {
  const [editing, setEditing] = useState(false)
  const [newTarget, setNewTarget] = useState(target ?? 24)

  if (!target) {
    return (
      <div className="bg-white border border-[#D9D2C7] rounded-xl p-5 shadow-sm h-full flex flex-col items-center justify-center text-center gap-4">
        <div className="p-3 bg-[#EDE8DF] rounded-full">
          <Target size={22} className="text-[#C4A882]" strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#5C4033]">ยังไม่ได้ตั้งเป้าหมาย</p>
          <p className="text-xs text-[#8B6F5E] mt-1">ตั้ง Reading Goal เพื่อดูความก้าวหน้า</p>
        </div>
        <Link
          href="/settings"
          className="text-xs font-medium text-[#C07B5A] border border-[#C07B5A] rounded-lg px-4 py-2 hover:bg-[#FDF5F0] transition-all"
        >
          ตั้ง Goal ของคุณ &#x2192;
        </Link>
      </div>
    )
  }

  const percent = Math.min((completed / target) * 100, 100)
  const remaining = Math.max(target - completed, 0)

  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  const monthsLeft = Math.max(12 - new Date().getMonth(), 1)
  const monthlyPaceMin = Math.floor(remaining / monthsLeft)
  const monthlyPaceMax = Math.ceil(remaining / monthsLeft)

  return (
    <div className="bg-white border border-[#D9D2C7] rounded-xl p-5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F5E]">
          Reading Goal {year}
        </h3>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs text-[#C07B5A] hover:underline"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {editing ? (
        <form
          action={async (formData) => {
            await updateReadingGoal(formData)
            setEditing(false)
          }}
          className="space-y-3 flex-1"
        >
          <input type="hidden" name="year" value={year} />
          <div>
            <label className="text-xs text-[#8B6F5E]">เป้าหมาย (เล่ม / ปี)</label>
            <input
              type="number"
              name="targetBooks"
              min={1}
              max={365}
              value={newTarget}
              onChange={(e) => setNewTarget(Number(e.target.value))}
              className="w-full mt-1 border border-[#D9D2C7] rounded-lg px-3 py-2 text-sm text-[#5C4033] focus:outline-none focus:border-[#C07B5A]"
            />
          </div>
          {newTarget > 0 && (
            <p className="text-xs text-[#8B6F5E]">
              = {Math.ceil(newTarget / 12)} เล่ม / เดือน
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-[#C07B5A] text-white text-sm rounded-lg py-2 hover:bg-[#A86845] transition-colors"
          >
            บันทึก
          </button>
        </form>
      ) : (
        <div className="flex flex-1 items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#EDE8DF"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#C07B5A"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.7s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#5C4033]">{completed}</span>
              <span className="text-[10px] text-[#8B6F5E]">OF {target}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div>
              <p className="text-lg font-bold text-[#5C4033]">{Math.round(percent)}% Complete</p>
              <p className="text-xs text-[#8B6F5E] mt-0.5">
                {"You've read "}
                <span className="text-[#C07B5A] font-semibold">{completed} books</span>
                {remaining > 0
                  ? `. Keep going! ${remaining} more to reach your goal.`
                  : ". Goal achieved!"}
              </p>
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-xs text-[#8B6F5E] mb-1">
                <span>Monthly Pace</span>
                <span className="font-bold text-[#5C4033]">
    {monthlyPaceMin === monthlyPaceMax
    ? `${monthlyPaceMin} / month`
    : `${monthlyPaceMin}–${monthlyPaceMax} / month`}
</span>
              </div>
              <div className="w-full bg-[#EDE8DF] rounded-full h-2">
                <div
                  className="bg-[#C07B5A] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-[10px] text-[#8B6F5E] mt-1">Based on remaining months</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
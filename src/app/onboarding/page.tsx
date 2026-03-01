'use client'

import { useState, useTransition } from 'react'
import { saveGoal } from '@/actions/onboarding'
import { Check } from 'lucide-react'

export default function OnboardingPage() {
  // ค่าเริ่มต้นคือ Moderate (24) ตาม Spec
  const [goal, setGoal] = useState(24)
  const [isPending, startTransition] = useTransition()

  const presets = [
    { label: 'Beginner', value: 12, desc: '1 book / month' },
    { label: 'Moderate', value: 24, desc: '2 books / month' },
    { label: 'Ambitious', value: 52, desc: '1 book / week' },
  ]

  const handleSave = () => {
    startTransition(async () => {
      await saveGoal(goal)
    })
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 font-sans text-[#5C4033]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Welcome to My Library</h1>
          <p className="text-[#8B6F5E]">มาตั้งเป้าหมายการอ่านในปี 2026 กันครับ</p>
        </div>

        {/* Goal Card */}
        <div className="bg-[#EDE8DF] border border-[#D9D2C7] rounded-[16px] p-8 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#8B6F5E] mb-6 block">
            Yearly Reading Goal
          </label>

          {/* Presets */}
          <div className="space-y-3 mb-8">
            {presets.map((p) => (
              <button
                key={p.value}
                onClick={() => setGoal(p.value)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                  goal === p.value
                    ? 'bg-white border-[#C07B5A] ring-1 ring-[#C07B5A]'
                    : 'bg-white/50 border-[#D9D2C7] hover:border-[#C4A882]'
                }`}
              >
                <div className="text-left">
                  <div className="font-bold text-sm">{p.label}</div>
                  <div className="text-xs text-[#8B6F5E]">{p.desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{p.value}</span>
                  {goal === p.value && <Check size={16} className="text-[#C07B5A]" />}
                </div>
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="mb-8">
            <p className="text-xs text-[#8B6F5E] mb-2">หรือกำหนดเอง</p>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="w-full bg-white border border-[#D9D2C7] rounded-lg p-3 text-center text-xl font-bold focus:border-[#C07B5A] outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full bg-[#C07B5A] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Start My Journey'}
            </button>
            <button
              className="w-full text-[#8B6F5E] text-sm font-medium py-2 hover:text-[#5C4033] transition-colors"
              onClick={() => window.location.href = '/dashboard'}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
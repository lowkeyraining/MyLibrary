'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveGoal } from '@/app/actions/onboarding'

export default function OnboardingPage() {
  const [goal, setGoal] = useState(24)
  const [activePreset, setActivePreset] = useState(24)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const presets = [
    { value: 12, name: 'Beginner', hint: '1 เล่ม / เดือน' },
    { value: 24, name: 'Moderate', hint: '2 เล่ม / เดือน' },
    { value: 52, name: 'Ambitious', hint: '~4 เล่ม / เดือน' }
  ]

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-10">
      <div className="w-full max-w-md bg-white border border-[#D9D2C7] rounded-2xl p-10">
        
        <p className="text-xs font-semibold uppercase tracking-wider text-[#C07B5A] mb-3">
          Getting Started · Step 1 of 1
        </p>
        <h1 className="text-2xl font-bold mb-2">ตั้งเป้าหมายการอ่าน</h1>
        <p className="text-sm text-[#8B6F5E] mb-8">
          เลือก Yearly Reading Goal ของคุณ ระบบจะคำนวณเป้ารายเดือนให้อัตโนมัติ
        </p>

        {/* Preset buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                setGoal(preset.value)
                setActivePreset(preset.value)
              }}
              className={`
                border-2 rounded-xl p-5 text-center transition-all
                ${activePreset === preset.value 
                  ? 'border-[#C07B5A] bg-[#C07B5A]/5' 
                  : 'border-[#D9D2C7] bg-[#FAF9F6] hover:border-[#C4A882]'
                }
              `}
            >
              <div className="text-3xl font-bold">{preset.value}</div>
              <div className="text-xs font-semibold text-[#8B6F5E] mt-1">{preset.name}</div>
              <div className="text-[10px] text-[#8B6F5E] opacity-70 mt-1">{preset.hint}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 my-4 text-xs text-[#8B6F5E]">
          <hr className="flex-1 border-[#D9D2C7]"/>
          <span>หรือกรอกเอง</span>
          <hr className="flex-1 border-[#D9D2C7]"/>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="number"
            placeholder="จำนวนเล่ม"
            min="1"
            max="365"
            className="flex-1 bg-[#FAF9F6] border border-[#D9D2C7] rounded-lg px-2 py-3 text-center font-semibold focus:border-[#C07B5A] outline-none"
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0
              if (val > 0) {
                setGoal(val)
                setActivePreset(0)
              }
            }}
          />
          <span className="text-sm text-[#8B6F5E]">เล่ม / ปี</span>
        </div>

        <p className="text-sm text-[#8B6F5E] mb-8">เป้ารายเดือน: {Math.ceil(goal / 12)} เล่ม</p>

        <div className="flex gap-3">
          <button 
            disabled={loading}
            className="flex-1 bg-[#5C4033] text-[#FAF9F6] py-3 rounded-lg font-semibold hover:bg-[#C07B5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           onClick={async () => {
 router.push('/')
  try {
    await saveGoal(goal)
  } catch (e) {
    console.error(e)
    setLoading(false)  // ← reset ถ้า error
  }
}}
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกและเริ่มต้น'}
          </button>
          
          <button 
            disabled={loading}
            className="px-8 py-3 border border-[#D9D2C7] text-[#8B6F5E] rounded-lg hover:border-[#C4A882] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => router.push('/')}
          >
            skip
          </button>
        </div>

      </div>
    </div>
  )
}
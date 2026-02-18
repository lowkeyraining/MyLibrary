'use client'
import { useState, useTransition } from 'react'
import { saveGoal } from '@/app/actions/onboarding'

export default function OnboardingPage() {
  const [goal, setGoal] = useState(24)
  const [activePreset, setActivePreset] = useState(24)
  const [isPending, startTransition] = useTransition()
  
  const handleSave = () => {
    startTransition(async () => {
      await saveGoal(goal)
    })
  }
}
'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function saveGoal(yearlyGoal: number) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  await prisma.readingGoal.upsert({        // ← เปลี่ยนจาก .create
    where: {
      userId_period_year_month: {
        userId: session.user.id,
        period: 'YEARLY',
        year: new Date().getFullYear(),
        month: 0
      }
    },
    update: { targetBooks: yearlyGoal },
    create: {
      userId: session.user.id,
      period: 'YEARLY',
      targetBooks: yearlyGoal,
      year: new Date().getFullYear()
    }
  })

  redirect('/')
}
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function saveGoal(targetBooks: number) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id
  const year = new Date().getFullYear()

  if (targetBooks && targetBooks > 0) {
    await prisma.readingGoal.upsert({
      where: {
        userId_period_year_month: {
          userId,
          period: "YEARLY",
          year,
          month: 0,
        },
      },
      update: { targetBooks },
      create: {
        userId,
        period: "YEARLY",
        year,
        month: 0,
        targetBooks,
      },
    })
  }

  redirect("/dashboard")
}
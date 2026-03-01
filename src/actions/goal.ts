"use server"

import { prisma } from "@/lib/prisma" // ← ใช้ singleton แทน new PrismaClient()
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function saveGoalAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id
  const raw = formData.get("targetBooks")
  const targetBooks = raw ? Number(raw) : null
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

export async function updateReadingGoal(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const userId = session.user.id
  const year = Number(formData.get("year"))
  const targetBooks = Number(formData.get("targetBooks"))

  if (!year || !targetBooks || targetBooks < 1) throw new Error("Invalid input")

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

  revalidatePath("/dashboard")
  revalidatePath("/settings")
}
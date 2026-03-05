"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function updateUserProfile(name: string, email: string, password?: string, image?: string, currentPassword?: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  try {
    const updateData: any = { name, email }

    if (image) updateData.image = image

    if (password) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true }
      })

      if (!user?.password) {
        return { success: false, error: "ไม่พบข้อมูลรหัสผ่าน" }
      }

      const isCorrect = await bcrypt.compare(currentPassword || "", user.password)
      if (!isCorrect) {
        return { success: false, error: "รหัสผ่านเดิมไม่ถูกต้อง" }
      }

      updateData.password = await bcrypt.hash(password, 10)
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData
    })

    revalidatePath("/settings")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Database error" }
  }
}

export async function updateReadingGoal(targetBooks: number) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  const year = new Date().getFullYear()

  try {
    const existingGoal = await prisma.readingGoal.findFirst({
      where: { userId: session.user.id, period: "YEARLY", year: year }
    })

    if (existingGoal) {
      await prisma.readingGoal.update({
        where: { id: existingGoal.id },
        data: { targetBooks }
      })
    } else {
      await prisma.readingGoal.create({
        data: {
          userId: session.user.id,
          period: "YEARLY",
          year: year,
          targetBooks: targetBooks
        }
      })
    }

    revalidatePath("/settings")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Database error" }
  }
}
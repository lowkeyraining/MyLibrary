"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

interface ProfileData {
  name: string
  username: string
  currentPassword?: string
  newPassword?: string
}

export async function updateProfile(data: ProfileData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    if (data.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: data.username }
      })
      if (existingUser && existingUser.id !== session.user.id) {
        return { success: false, error: "Username นี้มีผู้ใช้งานแล้ว" }
      }
    }

    // ถ้าต้องการเปลี่ยนรหัสผ่าน
    let hashedNewPassword: string | undefined
    if (data.newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true }
      })

      if (!user?.password) {
        return { success: false, error: "ไม่พบข้อมูลรหัสผ่าน" }
      }

      // เช็คว่ารหัสผ่านเดิมถูกต้องไหม
      const isCorrect = await bcrypt.compare(data.currentPassword || "", user.password)
      if (!isCorrect) {
        return { success: false, error: "รหัสผ่านเดิมไม่ถูกต้อง" }
      }

      hashedNewPassword = await bcrypt.hash(data.newPassword, 10)
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        username: data.username,
        ...(hashedNewPassword ? { password: hashedNewPassword } : {}),
      }
    })

    revalidatePath("/settings")
    return { success: true }

  } catch (error) {
    console.error(error)
    return { success: false, error: "เกิดข้อผิดพลาดกับฐานข้อมูล" }
  }
}

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true
    }
  })

  return user
}
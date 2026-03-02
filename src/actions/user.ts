"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

interface ProfileData {
  name: string
  username: string
}

export async function updateProfile(data: ProfileData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    // เช็คก่อนว่า Username นี้มีคนอื่นใช้ไปหรือยัง (ถ้าพิมพ์เปลี่ยนใหม่)
    if (data.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: data.username }
      })
      // ถ้ามีคนใช้แล้ว และไม่ใช่ตัวเราเอง
      if (existingUser && existingUser.id !== session.user.id) {
        return { success: false, error: "Username นี้มีผู้ใช้งานแล้ว" }
      }
    }

    // อัปเดตข้อมูลใน Database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        username: data.username,
      }
    })

    // สั่งให้หน้าเว็บดึงข้อมูลใหม่
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
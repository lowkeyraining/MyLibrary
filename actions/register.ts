"use server"

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"

const prisma = new PrismaClient()

const RegisterSchema = z.object({
  username: z.string().min(2, "Username is required"), // รับค่าเป็น username แต่ใน DB เก็บใน field 'name' ได้
  lastname: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function register(formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    username: formData.get("username"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return { error: "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" }
  }

  const { email, password, username, lastname } = validatedFields.data

  // รวมชื่อ-นามสกุล (ถ้ามี)
  const fullName = lastname ? `${username} ${lastname}` : username

  // เช็คว่ามี email นี้ในระบบหรือยัง
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Email นี้ถูกใช้งานแล้ว" }
  }

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(password, 10)

  // บันทึกลง Database
  await prisma.user.create({
    data: {
      name: fullName,
      email,
      password: hashedPassword,
    },
  })

  return { success: "สมัครสมาชิกสำเร็จ!" }
}
// actions/register.ts
"use server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function register(formData: FormData) {
  const firstname = formData.get("firstname") as string
  const lastname = formData.get("lastname") as string
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  })

  if (existing) return { error: "Username หรือ Email นี้ถูกใช้งานแล้ว" }

  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: {
      name: `${firstname} ${lastname}`.trim(),
      username,
      email,
      password: hashedPassword,
    },
  })
  return { success: true }
}
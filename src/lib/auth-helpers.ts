import 'server-only'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function verifyUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user?.password) return null
  
  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}
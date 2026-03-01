
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function verifyUser(identifier: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  })

  if (!user?.password) return null

  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // dynamic import เพื่อไม่ให้ลาก prisma เข้า edge
        const { verifyUser } = await import('@/lib/auth-helpers')
        return verifyUser(credentials.email as string, credentials.password as string)
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token) session.user.id = token.id as string
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected = 
        nextUrl.pathname.startsWith("/dashboard") || 
        nextUrl.pathname.startsWith("/books")
      if (isProtected) return isLoggedIn
      return true
    },
  },
  pages: { signIn: "/login" },
})
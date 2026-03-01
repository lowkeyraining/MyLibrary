import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ✅ guard เหมือนเดิม
        if (!credentials?.identifier || !credentials?.password) return null

        const { verifyUser } = await import('@/lib/auth-helpers')
        const user = await verifyUser(
          credentials.identifier as string,
          credentials.password as string
        )

        console.log("verifyUser result:", user)

        // ✅ เปลี่ยนจาก throw Error → return null
        // throw จะทำให้ NextAuth redirect ไป /api/auth/error
        // return null จะส่ง error กลับ client ผ่าน result.error แทน
        if (!user) return null

        return user
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
    // ✅ ลบ authorized callback ออก — ให้ middleware.ts จัดการอย่างเดียว
    // มี 2 ที่แล้วมันชนกัน
  },
pages: {
  signIn: "/login",
  error: "/login",  // ✅ เพิ่มบรรทัดนี้
},
})
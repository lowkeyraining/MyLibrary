import NextAuth from "next-auth"
import { auth } from "./auth" // อ้างอิงไฟล์ auth.ts

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')

  if (isOnDashboard) {
    if (isLoggedIn) return
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  if (isOnAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', req.nextUrl))
    }
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
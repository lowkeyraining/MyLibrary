import { auth } from "./auth"
 
export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')

  if (isOnDashboard) {
    if (isLoggedIn) return // ให้ผ่านไปได้
    return Response.redirect(new URL('/login', req.nextUrl)) // ดีดกลับไปหน้า Login
  }

  if (isOnAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', req.nextUrl)) // ถ้า Login แล้ว จะเข้าหน้า Login ไม่ได้ ให้ไป Dashboard เลย
    }
  }
})
 
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
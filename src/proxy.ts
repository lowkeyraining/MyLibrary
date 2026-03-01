import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// ✅ รวม protected routes ไว้ที่นี่ที่เดียว ชัดเจน
const PROTECTED_ROUTES = [
  '/dashboard',
  '/books',
  '/favorites',
  '/settings',
]

// ✅ Routes ที่ login แล้วไม่ควรเข้า (redirect ไป dashboard)
const AUTH_ROUTES = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // ✅ ระบุ secret ชัดเจน
  })
  const isLoggedIn = !!token
  const pathname = request.nextUrl.pathname

  const isProtected = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  )
  const isAuthRoute = AUTH_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  // ✅ ยังไม่ login + เข้า protected route → ไป /login
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ login แล้ว + พยายามเข้า /login หรือ /register → ไป /dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // ✅ matcher ให้ครอบทุก route ยกเว้น static files และ api/auth
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
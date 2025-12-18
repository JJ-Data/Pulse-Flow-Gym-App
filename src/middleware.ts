import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    const isProtected =
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/profile') ||
        nextUrl.pathname.startsWith('/billing') ||
        nextUrl.pathname.startsWith('/feedback')

    const isAdmin = nextUrl.pathname.startsWith('/admin')

    if (isProtected) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', nextUrl))
        }
        if (req.auth?.user?.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin', nextUrl))
        }
    }

    if (isAdmin) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', nextUrl))
        }
        if (req.auth?.user?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', nextUrl))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/profile/:path*', '/billing/:path*', '/feedback/:path*']
}

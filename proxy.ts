import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(AUTH_COOKIE_NAME)

  if (!hasSession) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    )

    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/messages/:path*"],
}

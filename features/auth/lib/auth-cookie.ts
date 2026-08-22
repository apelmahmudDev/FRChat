import "server-only"

import { cookies } from "next/headers"

export const AUTH_COOKIE_NAME = "frchat_access_token"

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
  priority: "high",
} as const

export async function hasAuthSessionCookie() {
  return (await cookies()).has(AUTH_COOKIE_NAME)
}

export const AUTH_COOKIE_NAME = "frchat_access_token"

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
  priority: "high",
} as const

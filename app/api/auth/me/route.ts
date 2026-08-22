import { cookies } from "next/headers"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import {
  authSessionSchema,
  upstreamCurrentUserSchema,
} from "@/features/auth/schemas/auth.schema"
import {
  invalidUpstreamResponse,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
import { upstreamRequest } from "@/lib/api/server"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return Response.json(
      { message: "Authentication required.", code: "UNAUTHENTICATED" },
      { status: 401 }
    )
  }

  try {
    const { body, response } = await upstreamRequest("/auth/me", { token })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        cookieStore.delete(AUTH_COOKIE_NAME)
      }

      return upstreamErrorResponse(body, response, "Unable to restore session.")
    }

    const parsedUser = upstreamCurrentUserSchema.safeParse(body)

    if (!parsedUser.success) {
      return invalidUpstreamResponse(
        "authentication",
        "Invalid /auth/me response",
        parsedUser.error
      )
    }

    return Response.json(authSessionSchema.parse({ user: parsedUser.data }), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    return serviceUnavailableResponse(
      "authentication",
      "Authentication API unavailable",
      error
    )
  }
}

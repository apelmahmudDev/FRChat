import { cookies } from "next/headers"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import {
  authSessionSchema,
  upstreamCurrentUserSchema,
} from "@/features/auth/schemas/auth.schema"
import { normalizeApiError } from "@/lib/api/error"
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

      return Response.json(
        normalizeApiError(body, "Unable to restore session."),
        {
          status: response.status,
        }
      )
    }

    const parsedUser = upstreamCurrentUserSchema.safeParse(body)

    if (!parsedUser.success) {
      console.error("Invalid /auth/me response", parsedUser.error)
      return Response.json(
        {
          message: "The authentication server returned an invalid response.",
          code: "INVALID_UPSTREAM_RESPONSE",
        },
        { status: 502 }
      )
    }

    return Response.json(authSessionSchema.parse({ user: parsedUser.data }), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("Authentication API unavailable", error)
    return Response.json(
      {
        message: "The authentication service is currently unavailable.",
        code: "UPSTREAM_UNAVAILABLE",
      },
      { status: 503 }
    )
  }
}

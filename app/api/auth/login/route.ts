import { cookies } from "next/headers"

import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
} from "@/features/auth/lib/auth-cookie"
import {
  authSessionSchema,
  upstreamLoginResponseSchema,
} from "@/features/auth/schemas/auth.schema"
import { signInFormSchema } from "@/features/auth/schemas/sign-in.schema"
import { normalizeApiError } from "@/lib/api/error"
import { upstreamRequest } from "@/lib/api/server"

export async function POST(request: Request) {
  const requestBody: unknown = await request.json().catch(() => null)
  const parsedRequest = signInFormSchema.safeParse(requestBody)

  if (!parsedRequest.success) {
    return Response.json(
      {
        message: "Please check the highlighted fields.",
        code: "VALIDATION_ERROR",
        fieldErrors: parsedRequest.error.flatten().fieldErrors,
      },
      { status: 422 }
    )
  }

  try {
    const { body, response } = await upstreamRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(parsedRequest.data),
    })

    if (!response.ok) {
      return Response.json(normalizeApiError(body, "Unable to sign in."), {
        status: response.status,
      })
    }

    const parsedResponse = upstreamLoginResponseSchema.safeParse(body)

    if (!parsedResponse.success) {
      console.error("Invalid /auth/login response", parsedResponse.error)
      return Response.json(
        {
          message: "The authentication server returned an invalid response.",
          code: "INVALID_UPSTREAM_RESPONSE",
        },
        { status: 502 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set(
      AUTH_COOKIE_NAME,
      parsedResponse.data.token,
      authCookieOptions
    )

    return Response.json(
      authSessionSchema.parse({ user: parsedResponse.data.user }),
      { headers: { "Cache-Control": "no-store" } }
    )
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

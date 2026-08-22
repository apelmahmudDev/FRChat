import "server-only"

import { cookies } from "next/headers"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { normalizeApiError } from "@/lib/api/error"

export type RouteContext<TParams> = { params: Promise<TParams> }
type UpstreamService = "authentication" | "conversations" | "messages" | "users"

type ApiAuthResult =
  { ok: true; token: string } | { ok: false; response: Response }

export async function requireApiAuth(): Promise<ApiAuthResult> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value

  if (token) return { ok: true, token }

  return {
    ok: false,
    response: Response.json(
      { message: "Authentication required.", code: "UNAUTHENTICATED" },
      { status: 401 }
    ),
  }
}

export function upstreamErrorResponse(
  body: unknown,
  response: Response,
  fallbackMessage: string
) {
  return Response.json(normalizeApiError(body, fallbackMessage), {
    status: response.status,
  })
}

export function invalidUpstreamResponse(
  service: UpstreamService,
  context: string,
  details?: unknown
) {
  console.error(context, details)

  return Response.json(
    {
      message: `The ${service} service returned an invalid response.`,
      code: "INVALID_UPSTREAM_RESPONSE",
    },
    { status: 502 }
  )
}

export function serviceUnavailableResponse(
  service: UpstreamService,
  context: string,
  error: unknown
) {
  console.error(context, error)

  return Response.json(
    {
      message: `The ${service} service is currently unavailable.`,
      code: "UPSTREAM_UNAVAILABLE",
    },
    { status: 503 }
  )
}

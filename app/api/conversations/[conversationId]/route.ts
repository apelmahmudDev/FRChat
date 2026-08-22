import { cookies } from "next/headers"
import { z } from "zod"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { normalizeApiError } from "@/lib/api/error"
import { upstreamRequest } from "@/lib/api/server"

const paramsSchema = z.object({ conversationId: z.string().min(1) })
const renameSchema = z.object({ name: z.string().trim().min(1).max(100) })

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const routeParams = paramsSchema.safeParse(await params)
  const payload = renameSchema.safeParse(await request.json().catch(() => null))
  if (!routeParams.success || !payload.success) {
    return Response.json(
      { message: payload.error?.issues[0]?.message ?? "Invalid group name." },
      { status: 400 }
    )
  }
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value
  if (!token)
    return Response.json(
      { message: "Authentication required." },
      { status: 401 }
    )

  try {
    const { body, response } = await upstreamRequest(
      `/conversations/${encodeURIComponent(routeParams.data.conversationId)}`,
      { method: "PATCH", token, body: JSON.stringify(payload.data) }
    )
    if (!response.ok)
      return Response.json(
        normalizeApiError(body, "Unable to rename the group."),
        { status: response.status }
      )
    return Response.json(body ?? null, { status: response.status })
  } catch (error) {
    console.error("Unable to rename group", error)
    return Response.json(
      { message: "The conversations service is currently unavailable." },
      { status: 503 }
    )
  }
}

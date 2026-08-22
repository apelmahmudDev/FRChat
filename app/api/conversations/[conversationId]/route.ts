import { z } from "zod"

import {
  requireApiAuth,
  type RouteContext,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
import { upstreamRequest } from "@/lib/api/server"

const paramsSchema = z.object({ conversationId: z.string().min(1) })
const renameSchema = z.object({ name: z.string().trim().min(1).max(100) })

export async function PATCH(
  request: Request,
  { params }: RouteContext<{ conversationId: string }>
) {
  const routeParams = paramsSchema.safeParse(await params)
  const payload = renameSchema.safeParse(await request.json().catch(() => null))
  if (!routeParams.success || !payload.success) {
    return Response.json(
      { message: payload.error?.issues[0]?.message ?? "Invalid group name." },
      { status: 400 }
    )
  }
  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  try {
    const { body, response } = await upstreamRequest(
      `/conversations/${encodeURIComponent(routeParams.data.conversationId)}`,
      {
        method: "PATCH",
        token: auth.token,
        body: JSON.stringify(payload.data),
      }
    )
    if (!response.ok)
      return upstreamErrorResponse(
        body,
        response,
        "Unable to rename the group."
      )
    return Response.json(body ?? null, { status: response.status })
  } catch (error) {
    return serviceUnavailableResponse(
      "conversations",
      "Unable to rename group",
      error
    )
  }
}

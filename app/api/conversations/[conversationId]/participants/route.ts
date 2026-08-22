import { z } from "zod"

import {
  requireApiAuth,
  type RouteContext,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
import { upstreamRequest } from "@/lib/api/server"

const paramsSchema = z.object({ conversationId: z.string().min(1) })
const participantSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1).max(100),
})

export async function POST(
  request: Request,
  { params }: RouteContext<{ conversationId: string }>
) {
  const routeParams = paramsSchema.safeParse(await params)
  const payload = participantSchema.safeParse(
    await request.json().catch(() => null)
  )
  if (!routeParams.success || !payload.success) {
    return Response.json(
      {
        message:
          payload.error?.issues[0]?.message ?? "Select at least one user.",
      },
      { status: 400 }
    )
  }
  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  try {
    const { body, response } = await upstreamRequest(
      `/conversations/${encodeURIComponent(routeParams.data.conversationId)}/participants`,
      { method: "POST", token: auth.token, body: JSON.stringify(payload.data) }
    )
    if (!response.ok)
      return upstreamErrorResponse(body, response, "Unable to add members.")
    return Response.json(body ?? null, { status: response.status })
  } catch (error) {
    return serviceUnavailableResponse(
      "conversations",
      "Unable to add group members",
      error
    )
  }
}

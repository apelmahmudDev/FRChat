import { z } from "zod"

import {
  requireApiAuth,
  type RouteContext,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
import { upstreamRequest } from "@/lib/api/server"

const paramsSchema = z.object({
  conversationId: z.string().min(1),
  userId: z.string().min(1),
})

export async function DELETE(
  _request: Request,
  { params }: RouteContext<{ conversationId: string; userId: string }>
) {
  const routeParams = paramsSchema.safeParse(await params)
  if (!routeParams.success)
    return Response.json({ message: "Invalid group member." }, { status: 400 })
  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  try {
    const { body, response } = await upstreamRequest(
      `/conversations/${encodeURIComponent(routeParams.data.conversationId)}/participants/${encodeURIComponent(routeParams.data.userId)}`,
      { method: "DELETE", token: auth.token }
    )
    if (!response.ok)
      return upstreamErrorResponse(body, response, "Unable to remove member.")
    return Response.json(body ?? null, { status: response.status })
  } catch (error) {
    return serviceUnavailableResponse(
      "conversations",
      "Unable to remove group member",
      error
    )
  }
}

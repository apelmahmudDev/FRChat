import { z } from "zod"

import {
  requireApiAuth,
  type RouteContext,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
import { upstreamRequest } from "@/lib/api/server"

const paramsSchema = z.object({ conversationId: z.string().min(1) })
const adminSchema = z.object({ userId: z.string().min(1) })

export async function POST(
  request: Request,
  { params }: RouteContext<{ conversationId: string }>
) {
  const routeParams = paramsSchema.safeParse(await params)
  const payload = adminSchema.safeParse(await request.json().catch(() => null))
  if (!routeParams.success || !payload.success)
    return Response.json(
      { message: "Select a member to promote." },
      { status: 400 }
    )
  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  try {
    const { body, response } = await upstreamRequest(
      `/conversations/${encodeURIComponent(routeParams.data.conversationId)}/admins`,
      { method: "POST", token: auth.token, body: JSON.stringify(payload.data) }
    )
    if (!response.ok)
      return upstreamErrorResponse(body, response, "Unable to promote member.")
    return Response.json(body ?? null, { status: response.status })
  } catch (error) {
    return serviceUnavailableResponse(
      "conversations",
      "Unable to promote group member",
      error
    )
  }
}

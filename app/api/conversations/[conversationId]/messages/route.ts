import { z } from "zod"

import { parseMessageHistoryResponse } from "@/features/messages/schemas/message-history.schema"
import {
  invalidUpstreamResponse,
  requireApiAuth,
  type RouteContext,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
import { upstreamRequest } from "@/lib/api/server"

const paramsSchema = z.object({ conversationId: z.string().min(1) })
const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  before: z.string().min(1).optional(),
})

export async function GET(
  request: Request,
  { params }: RouteContext<{ conversationId: string }>
) {
  const routeParams = paramsSchema.safeParse(await params)
  const query = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  )

  if (!routeParams.success || !query.success) {
    return Response.json(
      { message: "Invalid message history request." },
      { status: 400 }
    )
  }

  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  const search = new URLSearchParams({ limit: String(query.data.limit) })
  if (query.data.before) search.set("before", query.data.before)

  try {
    const { body, response } = await upstreamRequest(
      `/conversations/${encodeURIComponent(routeParams.data.conversationId)}/messages?${search}`,
      { token: auth.token }
    )

    if (!response.ok) {
      return upstreamErrorResponse(
        body,
        response,
        "Unable to load message history."
      )
    }

    const messages = parseMessageHistoryResponse(body)
    if (!messages) {
      return invalidUpstreamResponse(
        "messages",
        "Invalid GET /conversations/:id/messages response",
        body
      )
    }

    return Response.json(messages)
  } catch (error) {
    return serviceUnavailableResponse(
      "messages",
      "Unable to load message history",
      error
    )
  }
}

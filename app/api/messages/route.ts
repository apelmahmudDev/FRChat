import { z } from "zod"

import {
  requireApiAuth,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
import { upstreamRequest } from "@/lib/api/server"

const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  text: z.string().trim().min(1, "A message cannot be empty.").max(4_000),
})
export async function POST(request: Request) {
  const payload = sendMessageSchema.safeParse(
    await request.json().catch(() => null)
  )
  if (!payload.success) {
    return Response.json(
      { message: payload.error.issues[0]?.message ?? "Invalid message." },
      { status: 400 }
    )
  }

  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  try {
    const { body, response } = await upstreamRequest("/messages", {
      method: "POST",
      token: auth.token,
      body: JSON.stringify(payload.data),
    })
    if (!response.ok) {
      return upstreamErrorResponse(body, response, "Unable to send message.")
    }

    // The message API acknowledges a successful write, but its response body is
    // not part of the message-history contract. Treat every successful HTTP
    // response as a send acknowledgement instead of rejecting a sent message
    // because optional metadata is absent or wrapped differently.
    return Response.json({ ok: true }, { status: response.status })
  } catch (error) {
    return serviceUnavailableResponse(
      "messages",
      "Unable to send message",
      error
    )
  }
}

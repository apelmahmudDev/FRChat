import { cookies } from "next/headers"
import { z } from "zod"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { normalizeApiError } from "@/lib/api/error"
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

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    return Response.json(
      { message: "Authentication required." },
      { status: 401 }
    )
  }

  try {
    const { body, response } = await upstreamRequest("/messages", {
      method: "POST",
      token,
      body: JSON.stringify(payload.data),
    })
    if (!response.ok) {
      return Response.json(normalizeApiError(body, "Unable to send message."), {
        status: response.status,
      })
    }

    // The message API acknowledges a successful write, but its response body is
    // not part of the message-history contract. Treat every successful HTTP
    // response as a send acknowledgement instead of rejecting a sent message
    // because optional metadata is absent or wrapped differently.
    return Response.json({ ok: true }, { status: response.status })
  } catch (error) {
    console.error("Unable to send message", error)
    return Response.json(
      { message: "The messages service is currently unavailable." },
      { status: 503 }
    )
  }
}

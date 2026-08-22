import { z } from "zod"

import { getServerConversations } from "@/features/conversations/api/conversations.server"
import {
  invalidUpstreamResponse,
  requireApiAuth,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
import { upstreamRequest } from "@/lib/api/server"

const createConversationSchema = z.object({
  userId: z.string().trim().min(1, "Enter a user ID."),
})

const upstreamCreatedConversationSchema = z
  .object({
    _id: z.string().min(1),
    participants: z.array(z.string().min(1)),
    createdAt: z.iso.datetime(),
  })
  .loose()

export async function GET() {
  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  try {
    return Response.json({
      data: await getServerConversations(auth.token),
    })
  } catch (error) {
    return serviceUnavailableResponse(
      "conversations",
      "Unable to load conversations",
      error
    )
  }
}

export async function POST(request: Request) {
  const payload = createConversationSchema.safeParse(
    await request.json().catch(() => null)
  )

  if (!payload.success) {
    return Response.json(
      {
        message: payload.error.issues[0]?.message ?? "Invalid request.",
        code: "VALIDATION_ERROR",
      },
      { status: 400 }
    )
  }

  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  try {
    const { body, response } = await upstreamRequest("/conversations", {
      method: "POST",
      token: auth.token,
      body: JSON.stringify(payload.data),
    })

    if (!response.ok) {
      return upstreamErrorResponse(
        body,
        response,
        "Unable to start the conversation."
      )
    }

    const parsedResponse = upstreamCreatedConversationSchema.safeParse(body)

    if (!parsedResponse.success) {
      return invalidUpstreamResponse(
        "conversations",
        "Invalid POST /conversations response",
        parsedResponse.error
      )
    }

    return Response.json(parsedResponse.data, { status: response.status })
  } catch (error) {
    return serviceUnavailableResponse(
      "conversations",
      "Unable to create conversation",
      error
    )
  }
}

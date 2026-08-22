import { cookies } from "next/headers"
import { z } from "zod"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { getServerConversations } from "@/features/conversations/api/conversations.server"
import { normalizeApiError } from "@/lib/api/error"
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
  try {
    return Response.json({ data: await getServerConversations() })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The conversations service is currently unavailable."

    return Response.json(
      { message },
      { status: message === "Authentication required." ? 401 : 503 }
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

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return Response.json(
      { message: "Authentication required.", code: "UNAUTHENTICATED" },
      { status: 401 }
    )
  }

  try {
    const { body, response } = await upstreamRequest("/conversations", {
      method: "POST",
      token,
      body: JSON.stringify(payload.data),
    })

    if (!response.ok) {
      return Response.json(
        normalizeApiError(body, "Unable to start the conversation."),
        {
          status: response.status,
        }
      )
    }

    const parsedResponse = upstreamCreatedConversationSchema.safeParse(body)

    if (!parsedResponse.success) {
      console.error(
        "Invalid POST /conversations response",
        parsedResponse.error
      )
      return Response.json(
        { message: "The conversations service returned an invalid response." },
        { status: 502 }
      )
    }

    return Response.json(parsedResponse.data, { status: response.status })
  } catch (error) {
    console.error("Unable to create conversation", error)
    return Response.json(
      { message: "The conversations service is currently unavailable." },
      { status: 503 }
    )
  }
}

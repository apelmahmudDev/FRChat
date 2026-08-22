import { cookies } from "next/headers"
import { z } from "zod"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { normalizeApiError } from "@/lib/api/error"
import { upstreamRequest } from "@/lib/api/server"

const createGroupSchema = z.object({
  name: z.string().trim().min(1).max(100),
  userIds: z.array(z.string().min(1)).min(1).max(100),
})
const createdGroupSchema = z.object({ _id: z.string().min(1) }).loose()

export async function POST(request: Request) {
  const payload = createGroupSchema.safeParse(
    await request.json().catch(() => null)
  )
  if (!payload.success) {
    return Response.json(
      { message: payload.error.issues[0]?.message ?? "Invalid group." },
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
    const requestBodies = [
      { name: payload.data.name, userIds: payload.data.userIds },
      { name: payload.data.name, participantIds: payload.data.userIds },
      { name: payload.data.name, participants: payload.data.userIds },
      { name: payload.data.name, memberIds: payload.data.userIds },
    ]
    let result = await upstreamRequest("/conversations/group", {
      method: "POST",
      token,
      body: JSON.stringify(requestBodies[0]),
    })

    for (const requestBody of requestBodies.slice(1)) {
      const error = normalizeApiError(result.body)
      const isValidationError =
        (result.response.status === 400 || result.response.status === 422) &&
        error.code === "VALIDATION_ERROR"

      if (!isValidationError) break

      result = await upstreamRequest("/conversations/group", {
        method: "POST",
        token,
        body: JSON.stringify(requestBody),
      })
    }

    const { body, response } = result
    if (!response.ok)
      return Response.json(normalizeApiError(body, "Unable to create group."), {
        status: response.status,
      })
    const parsed = createdGroupSchema.safeParse(body)
    if (!parsed.success)
      return Response.json(
        { message: "The conversations service returned an invalid response." },
        { status: 502 }
      )
    return Response.json(parsed.data, { status: response.status })
  } catch (error) {
    console.error("Unable to create group", error)
    return Response.json(
      { message: "The conversations service is currently unavailable." },
      { status: 503 }
    )
  }
}

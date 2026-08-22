import { cookies } from "next/headers"
import { z } from "zod"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { normalizeApiError } from "@/lib/api/error"
import { upstreamRequest } from "@/lib/api/server"

const createGroupSchema = z.object({
  name: z.string().trim().min(1).max(100),
  participantIds: z
    .array(z.string().min(1))
    .min(1)
    .max(100)
    .transform((participantIds) => [...new Set(participantIds)]),
})
const groupSchema = z.object({ _id: z.string().min(1) }).loose()
const createdGroupSchema = z
  .union([groupSchema, z.object({ data: groupSchema }).loose()])
  .transform((response) => ("data" in response ? response.data : response))

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
    const { body, response } = await upstreamRequest("/conversations/group", {
      method: "POST",
      token,
      body: JSON.stringify(payload.data),
    })
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

import { z } from "zod"

import {
  invalidUpstreamResponse,
  requireApiAuth,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
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
  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  try {
    const { body, response } = await upstreamRequest("/conversations/group", {
      method: "POST",
      token: auth.token,
      body: JSON.stringify(payload.data),
    })
    if (!response.ok)
      return upstreamErrorResponse(body, response, "Unable to create group.")
    const parsed = createdGroupSchema.safeParse(body)
    if (!parsed.success)
      return invalidUpstreamResponse(
        "conversations",
        "Invalid POST /conversations/group response",
        parsed.error
      )
    return Response.json(parsed.data, { status: response.status })
  } catch (error) {
    return serviceUnavailableResponse(
      "conversations",
      "Unable to create group",
      error
    )
  }
}

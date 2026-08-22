import { z } from "zod"

import { userMatchesSearch } from "@/features/users/lib/user-search"
import {
  type ChatUser,
  chatUserSchema,
} from "@/features/users/types/user.types"
import {
  invalidUpstreamResponse,
  requireApiAuth,
  serviceUnavailableResponse,
  upstreamErrorResponse,
} from "@/lib/api/route"
import { upstreamRequest } from "@/lib/api/server"

const searchSchema = z.object({
  q: z.string().trim().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(50).default(10),
})
const usersSchema = z.array(chatUserSchema)
const upstreamUsersSchema = z
  .union([
    usersSchema,
    z.object({ data: usersSchema }).loose(),
    z.object({ users: usersSchema }).loose(),
    z.object({ data: z.object({ users: usersSchema }).loose() }).loose(),
  ])
  .transform((response): ChatUser[] => {
    if (Array.isArray(response)) return response
    if ("users" in response) return usersSchema.parse(response.users)
    return Array.isArray(response.data) ? response.data : response.data.users
  })

export async function GET(request: Request) {
  const query = searchSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  )
  if (!query.success) {
    return Response.json(
      { message: "Enter at least one character to search for users." },
      { status: 400 }
    )
  }

  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  const search = new URLSearchParams({
    q: query.data.q,
    limit: String(query.data.limit),
  })

  try {
    const { body, response } = await upstreamRequest(
      `/users/search?${search}`,
      { token: auth.token }
    )
    if (!response.ok) {
      return upstreamErrorResponse(body, response, "Unable to search users.")
    }

    const users = upstreamUsersSchema.safeParse(body)
    if (!users.success) {
      return invalidUpstreamResponse(
        "users",
        "Invalid GET /users/search response",
        users.error
      )
    }

    return Response.json({
      data: users.data.filter((user) => userMatchesSearch(user, query.data.q)),
    })
  } catch (error) {
    return serviceUnavailableResponse("users", "Unable to search users", error)
  }
}

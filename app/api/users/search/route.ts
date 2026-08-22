import { cookies } from "next/headers"
import { z } from "zod"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { userMatchesSearch } from "@/features/users/lib/user-search"
import {
  type ChatUser,
  chatUserSchema,
} from "@/features/users/types/user.types"
import { normalizeApiError } from "@/lib/api/error"
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

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    return Response.json(
      { message: "Authentication required." },
      { status: 401 }
    )
  }

  const search = new URLSearchParams({
    q: query.data.q,
    limit: String(query.data.limit),
  })

  try {
    const { body, response } = await upstreamRequest(
      `/users/search?${search}`,
      { token }
    )
    if (!response.ok) {
      return Response.json(
        normalizeApiError(body, "Unable to search for users."),
        {
          status: response.status,
        }
      )
    }

    const users = upstreamUsersSchema.safeParse(body)
    if (!users.success) {
      console.error("Invalid GET /users/search response", users.error)
      return Response.json(
        { message: "The users service returned an invalid response." },
        { status: 502 }
      )
    }

    return Response.json({
      data: users.data.filter((user) => userMatchesSearch(user, query.data.q)),
    })
  } catch (error) {
    console.error("Unable to search users", error)
    return Response.json(
      { message: "The users service is currently unavailable." },
      { status: 503 }
    )
  }
}

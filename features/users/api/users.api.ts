import { z } from "zod"

import { clientApiRequest } from "@/lib/api/client"

import { chatUserSchema } from "../types/user.types"

const userSearchResponseSchema = z.object({ data: z.array(chatUserSchema) })

export function searchUsers(query: string) {
  const search = new URLSearchParams({ q: query, limit: "10" })

  return clientApiRequest(`/api/users/search?${search}` as `/api/${string}`, {
    method: "GET",
    schema: userSearchResponseSchema,
  }).then(({ data }) => data)
}

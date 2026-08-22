import { z } from "zod"

import { clientApiRequest } from "@/lib/api/client"

const createdConversationSchema = z.object({
  _id: z.string().min(1),
  participants: z.array(z.string().min(1)),
  createdAt: z.iso.datetime(),
})

export function createConversation(userId: string) {
  return clientApiRequest("/api/conversations", {
    method: "POST",
    body: { userId },
    schema: createdConversationSchema,
  })
}

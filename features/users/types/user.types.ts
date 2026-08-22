import { z } from "zod"

export const chatUserSchema = z.object({
  _id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
})

export type ChatUser = z.infer<typeof chatUserSchema>

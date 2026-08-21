import { z } from "zod"

const clientEnvSchema = z.object({
  NEXT_PUBLIC_CHAT_SOCKET_URL: z
    .url()
    .transform((url) => url.replace(/\/$/, "")),
})

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_CHAT_SOCKET_URL: process.env.NEXT_PUBLIC_CHAT_SOCKET_URL,
})

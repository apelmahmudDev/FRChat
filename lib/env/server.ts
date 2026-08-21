import "server-only"

import { z } from "zod"

const serverEnvSchema = z.object({
  CHAT_API_BASE_URL: z.url().transform((url) => url.replace(/\/$/, "")),
})

const parsedServerEnv = serverEnvSchema.safeParse({
  CHAT_API_BASE_URL: process.env.CHAT_API_BASE_URL,
})

if (!parsedServerEnv.success) {
  throw new Error(
    `Invalid server environment: ${z.prettifyError(parsedServerEnv.error)}`
  )
}

export const serverEnv = parsedServerEnv.data

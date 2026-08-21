import { z } from "zod"

export const authUserSchema = z
  .object({
    _id: z.string().min(1),
    name: z.string().min(1),
    phone: z.string().min(1),
    createdAt: z.iso.datetime(),
  })
  .loose()

export const upstreamLoginResponseSchema = z
  .object({
    token: z.string().min(1),
    user: authUserSchema,
  })
  .loose()

export const authSessionSchema = z.object({
  user: authUserSchema,
})

export const upstreamCurrentUserSchema = z.union([
  authUserSchema,
  authSessionSchema.transform(({ user }) => user),
])

export const socketTokenSchema = z.object({
  token: z.string().min(1),
})

export type AuthUser = z.infer<typeof authUserSchema>
export type AuthSession = z.infer<typeof authSessionSchema>

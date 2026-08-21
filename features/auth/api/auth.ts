import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

import { clientApiRequest } from "@/lib/api/client"
import { authSessionSchema, socketTokenSchema } from "../schemas/auth.schema"
import {
  type SignInFormValues,
  signInFormSchema,
} from "../schemas/sign-in.schema"

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  socketToken: () => [...authKeys.all, "socket-token"] as const,
}

export function login(values: SignInFormValues) {
  return clientApiRequest("/api/auth/login", {
    method: "POST",
    body: signInFormSchema.parse(values),
    schema: authSessionSchema,
  })
}

export function getCurrentSession() {
  return clientApiRequest("/api/auth/me", {
    method: "GET",
    schema: authSessionSchema,
  })
}

export function logout() {
  return clientApiRequest("/api/auth/logout", {
    method: "POST",
    schema: z.null(),
  })
}

export function getSocketToken() {
  return clientApiRequest("/api/auth/socket-token", {
    method: "GET",
    schema: socketTokenSchema,
  })
}

export const currentSessionQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.session(),
    queryFn: getCurrentSession,
    staleTime: 5 * 60_000,
  })

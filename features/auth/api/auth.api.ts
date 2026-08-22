import { z } from "zod"

import { clientApiRequest } from "@/lib/api/client"

import { authSessionSchema, socketTokenSchema } from "../schemas/auth.schema"
import {
  type SignInFormValues,
  signInFormSchema,
} from "../schemas/sign-in.schema"

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

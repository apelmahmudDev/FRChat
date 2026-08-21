import "server-only"

import { serverEnv } from "@/lib/env/server"

type UpstreamRequestOptions = RequestInit & {
  token?: string
}

export async function upstreamRequest(
  path: `/${string}`,
  { headers, token, ...init }: UpstreamRequestOptions = {}
) {
  const requestHeaders = new Headers(headers)
  requestHeaders.set("Accept", "application/json")

  if (init.body) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${serverEnv.CHAT_API_BASE_URL}${path}`, {
    ...init,
    headers: requestHeaders,
    cache: "no-store",
  })
  const body: unknown = await response.json().catch(() => null)

  return { body, response }
}

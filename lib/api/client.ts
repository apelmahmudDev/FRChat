import { z } from "zod"

import { ApiClientError, normalizeApiError } from "@/lib/api/error"

type ClientApiOptions<TSchema extends z.ZodType> = Omit<RequestInit, "body"> & {
  body?: unknown
  schema: TSchema
}

export async function clientApiRequest<TSchema extends z.ZodType>(
  path: `/api/${string}`,
  { body, headers, schema, ...init }: ClientApiOptions<TSchema>
): Promise<z.output<TSchema>> {
  const requestHeaders = new Headers(headers)

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json")
  }

  const response = await fetch(path, {
    ...init,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
  })

  const responseBody: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const error = normalizeApiError(responseBody)
    throw new ApiClientError(error.message, response.status, error.code)
  }

  const parsedResponse = schema.safeParse(responseBody)

  if (!parsedResponse.success) {
    throw new ApiClientError("The server returned an invalid response.", 502)
  }

  return parsedResponse.data
}

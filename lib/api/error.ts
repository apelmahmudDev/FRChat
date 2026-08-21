import { z } from "zod"

const apiErrorBodySchema = z
  .object({
    message: z.string().optional(),
    code: z.string().optional(),
    error: z
      .union([
        z.string(),
        z.object({
          message: z.string().optional(),
          code: z.string().optional(),
        }),
      ])
      .optional(),
  })
  .loose()

export type ApiErrorBody = {
  message: string
  code?: string
}

export class ApiClientError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.code = code
  }
}

export function normalizeApiError(
  value: unknown,
  fallback = "Something went wrong. Please try again."
): ApiErrorBody {
  const parsed = apiErrorBodySchema.safeParse(value)

  if (!parsed.success) {
    return { message: fallback }
  }

  if (typeof parsed.data.error === "string") {
    return { message: parsed.data.error, code: parsed.data.code }
  }

  return {
    message: parsed.data.message ?? parsed.data.error?.message ?? fallback,
    code: parsed.data.code ?? parsed.data.error?.code,
  }
}

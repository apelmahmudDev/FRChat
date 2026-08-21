import { cookies } from "next/headers"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { socketTokenSchema } from "@/features/auth/schemas/auth.schema"

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return Response.json(
      { message: "Authentication required.", code: "UNAUTHENTICATED" },
      { status: 401 }
    )
  }

  return Response.json(socketTokenSchema.parse({ token }), {
    headers: {
      "Cache-Control": "no-store, private",
      Pragma: "no-cache",
    },
  })
}

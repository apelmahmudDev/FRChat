import { socketTokenSchema } from "@/features/auth/schemas/auth.schema"
import { requireApiAuth } from "@/lib/api/route"

export async function GET() {
  const auth = await requireApiAuth()
  if (!auth.ok) return auth.response

  return Response.json(socketTokenSchema.parse({ token: auth.token }), {
    headers: {
      "Cache-Control": "no-store, private",
      Pragma: "no-cache",
    },
  })
}

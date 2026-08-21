type RouteParams = Record<string, string | number | undefined>

/**
 * ROUTES — define all your app routes here.
 * - Use plain strings for static paths
 * - Use builder functions for dynamic routes
 */

export const ROUTES = {
  HOME: "/",
  SIGNIN: "/sign-in",
  SIGNUP: "/sign-up",

  MESSAGES: {
    ROOT: "/messages",
  },
} as const

/**
 * buildRoute()
 * Dynamically replaces [param] placeholders in route templates.
 *
 * Example:
 * buildRoute("/verify-email/[token]", { token: "abc123" })
 * -> "/verify-email/abc123"
 */

export const buildRoute = <T extends string>(
  path: T,
  params?: RouteParams
): string => {
  if (!params) {
    return path
  }
  let url: string = path
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`[${key}]`, String(value))
  })
  return url
}

/**
 * Example Usages:
 *
 * import { ROUTES, buildRoute } from "@/routes/routes"
 * import Link from "next/link"
 *
 * Static route
 * <Link href={ROUTES.SIGNIN}>Sign in</Link>
 *
 * Route object usage
 * <Link href={ROUTES.MESSAGES.ROOT}>My Messages</Link>
 *
 * Dynamic route helpers
 * router.push(ROUTES.RESET_PASSWORD.TOKEN("abc123"))
 * router.push(ROUTES.VERIFY_EMAIL.TOKEN("abc123"))
 *
 * Dynamic route (manual builder)
 * const verifyEmailUrl = buildRoute(
 *   "/verify-email/[token]",
 *   { token: "abc123" }
 * )
 * router.push(verifyEmailUrl)
 *
 * Using constants for router navigation
 * import { useRouter } from "next/navigation"
 * const router = useRouter()
 * router.push(ROUTES.SIGNUP)
 *
 * Example in async logic
 * router.replace(ROUTES.MESSAGES.ROOT)
 */

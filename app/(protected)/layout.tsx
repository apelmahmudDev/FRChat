import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { SocketProvider } from "@/providers/socket-provider"

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    redirect("/sign-in")
  }

  return <SocketProvider>{children}</SocketProvider>
}

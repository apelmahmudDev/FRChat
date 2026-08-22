import { redirect } from "next/navigation"

import { hasAuthSessionCookie } from "@/features/auth/lib/auth-cookie"
import { SocketProvider } from "@/providers/socket-provider"

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await hasAuthSessionCookie())) {
    redirect("/sign-in")
  }

  return <SocketProvider>{children}</SocketProvider>
}

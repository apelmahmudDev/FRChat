import { cn } from "@/lib/utils"

export default function MessagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={cn("flex min-h-svh flex-col")}>{children}</div>
}

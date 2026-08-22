export default function MessagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="flex min-h-svh flex-col">{children}</div>
}

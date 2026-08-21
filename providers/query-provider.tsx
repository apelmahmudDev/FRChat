"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ApiClientError } from "@/lib/api/error"

function shouldRetry(failureCount: number, error: Error) {
  if (error instanceof ApiClientError && error.status < 500) {
    return false
  }

  return failureCount < 2
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 10 * 60_000,
        retry: shouldRetry,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export function QueryProvider({ children }: React.PropsWithChildren) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

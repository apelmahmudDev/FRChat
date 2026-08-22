import { infiniteQueryOptions } from "@tanstack/react-query"

import { getMessageHistory } from "./messages.api"
import { messageKeys } from "./messages.keys"

export const messageHistoryQueryOptions = (conversationId: string) =>
  infiniteQueryOptions({
    queryKey: messageKeys.list(conversationId),
    queryFn: ({ pageParam }) => getMessageHistory(conversationId, pageParam),
    initialPageParam: undefined as string | undefined,
    staleTime: 30_000,
    getNextPageParam: (page) =>
      page.hasMore ? (page.nextCursor ?? undefined) : undefined,
  })

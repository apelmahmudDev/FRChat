import { queryOptions } from "@tanstack/react-query"

import type { Conversation } from "../types/conversation.types"
import { getConversations } from "./conversations.api"
import { conversationKeys } from "./conversations.keys"

export const conversationListQueryOptions = (initialData: Conversation[]) =>
  queryOptions({
    queryKey: conversationKeys.list(),
    queryFn: getConversations,
    initialData,
    staleTime: 30_000,
  })

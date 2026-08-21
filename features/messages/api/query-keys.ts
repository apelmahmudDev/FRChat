export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  list: (conversationId: string) =>
    [...messageKeys.lists(), conversationId] as const,
}

export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  detail: (conversationId: string) =>
    [...conversationKeys.all, "detail", conversationId] as const,
}

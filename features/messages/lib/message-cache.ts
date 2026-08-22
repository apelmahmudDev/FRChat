import type {
  ChatMessage,
  MessageHistory,
} from "@/features/messages/types/message.types"

export function upsertReceivedMessage(
  history: MessageHistory | undefined,
  receivedMessage: ChatMessage
) {
  // An unopened conversation has no complete history to merge into. Let its
  // first mount fetch the canonical page instead of caching one partial item.
  if (!history) return history

  const exactMatchExists = history.pages.some((page) =>
    page.data.some(({ _id }) => _id === receivedMessage._id)
  )
  if (exactMatchExists) return history

  let optimisticMessageReplaced = false
  const pages = history.pages.map((page, index) => {
    if (index !== 0) return page

    const data = page.data.map((cachedMessage) => {
      const isMatchingOptimisticMessage =
        !optimisticMessageReplaced &&
        cachedMessage._id.startsWith("optimistic-") &&
        cachedMessage.sender === receivedMessage.sender &&
        cachedMessage.text === receivedMessage.text

      if (!isMatchingOptimisticMessage) return cachedMessage

      optimisticMessageReplaced = true
      return receivedMessage
    })

    return {
      ...page,
      data: optimisticMessageReplaced ? data : [receivedMessage, ...page.data],
    }
  })

  return { ...history, pages }
}

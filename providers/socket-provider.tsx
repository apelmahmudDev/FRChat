"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { io, type Socket } from "socket.io-client"

import { getSocketToken } from "@/features/auth/api/auth.api"
import { conversationKeys } from "@/features/conversations/api/conversations.keys"
import { messageKeys } from "@/features/messages/api/messages.keys"
import type { ChatMessage } from "@/features/messages/types/message.types"
import {
  socketConversationEventSchema,
  socketMessageEventSchema,
} from "@/features/realtime/schemas/socket-event.schema"
import { clientEnv } from "@/lib/env/client"

type ServerToClientEvents = {
  "message:new": (payload: unknown) => void
  "conversation:updated": (payload: unknown) => void
}

type ClientToServerEvents = {
  "message:send": (
    payload: { conversationId: string; text: string },
    acknowledgement?: (response: unknown) => void
  ) => void
}

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>

type MessageHistory = {
  pages: Array<{
    data: ChatMessage[]
    nextCursor: string | null
    hasMore: boolean
  }>
  pageParams: unknown[]
}

const SocketContext = createContext<ChatSocket | null>(null)

export function SocketProvider({ children }: React.PropsWithChildren) {
  const queryClient = useQueryClient()
  const [socket, setSocket] = useState<ChatSocket | null>(null)

  useEffect(() => {
    let active = true
    let activeSocket: ChatSocket | null = null

    async function connect() {
      const { token } = await getSocketToken()

      if (!active) return

      activeSocket = io(clientEnv.NEXT_PUBLIC_CHAT_SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
      })

      activeSocket.on("message:new", (payload) => {
        const parsedMessage = socketMessageEventSchema.safeParse(payload)

        void queryClient.invalidateQueries({ queryKey: conversationKeys.all })

        if (parsedMessage.success) {
          const message = parsedMessage.data
          const text = message.text ?? message.content

          if (
            message._id &&
            message.sender &&
            text !== undefined &&
            message.createdAt
          ) {
            const messageId = message._id
            const senderId = message.sender
            const createdAt = message.createdAt

            queryClient.setQueryData<MessageHistory>(
              messageKeys.list(message.conversationId),
              (history) => {
                const receivedMessage: ChatMessage = {
                  _id: messageId,
                  sender: senderId,
                  text,
                  createdAt,
                }

                if (!history) {
                  return {
                    pages: [
                      {
                        data: [receivedMessage],
                        nextCursor: null,
                        hasMore: false,
                      },
                    ],
                    pageParams: [undefined],
                  }
                }

                const exactMatchExists = history.pages.some((page) =>
                  page.data.some(
                    (cachedMessage) => cachedMessage._id === receivedMessage._id
                  )
                )

                if (exactMatchExists) return history

                let optimisticMessageReplaced = false

                return {
                  ...history,
                  pages: history.pages.map((page, index) => {
                    if (index !== 0) return page

                    const updatedMessages = page.data.map((cachedMessage) => {
                      const isMatchingOptimisticMessage =
                        !optimisticMessageReplaced &&
                        cachedMessage._id.startsWith("optimistic-") &&
                        cachedMessage.sender === receivedMessage.sender &&
                        cachedMessage.text === receivedMessage.text

                      if (!isMatchingOptimisticMessage) {
                        return cachedMessage
                      }

                      optimisticMessageReplaced = true
                      return receivedMessage
                    })

                    if (optimisticMessageReplaced) {
                      return { ...page, data: updatedMessages }
                    }

                    return {
                      ...page,
                      data: [receivedMessage, ...page.data],
                    }
                  }),
                }
              }
            )
          } else {
            void queryClient.invalidateQueries({
              queryKey: messageKeys.list(message.conversationId),
            })
          }
        }
      })

      activeSocket.on("connect_error", (error) => {
        console.error("Chat socket connection failed", error.message)
      })

      activeSocket.on("conversation:updated", (payload) => {
        const parsedConversation =
          socketConversationEventSchema.safeParse(payload)
        void queryClient.invalidateQueries({ queryKey: conversationKeys.all })

        if (parsedConversation.success) {
          const conversationId =
            parsedConversation.data._id ?? parsedConversation.data.id

          if (conversationId) {
            void queryClient.invalidateQueries({
              queryKey: conversationKeys.detail(conversationId),
            })
          }
        }
      })

      activeSocket.on("connect", () => {
        if (!active) return

        setSocket(activeSocket)
        // Recover messages that may have arrived while this browser was offline.
        void queryClient.invalidateQueries({ queryKey: messageKeys.all })
        void queryClient.invalidateQueries({ queryKey: conversationKeys.all })
      })
    }

    void connect().catch((error: unknown) => {
      console.error("Unable to connect to chat socket", error)
    })

    return () => {
      active = false
      activeSocket?.disconnect()
      setSocket(null)
    }
  }, [queryClient])

  const contextValue = useMemo(() => socket, [socket])

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

export function useChatSocket() {
  return useContext(SocketContext)
}

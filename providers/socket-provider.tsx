"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { io, type Socket } from "socket.io-client"

import { getSocketToken } from "@/features/auth/api/auth"
import {
  conversationKeys,
  messageKeys,
} from "@/features/messages/api/query-keys"
import type { ChatMessage } from "@/features/messages/api/messages"
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
            queryClient.setQueryData<{
              pages: Array<{
                data: ChatMessage[]
                nextCursor: string | null
                hasMore: boolean
              }>
              pageParams: unknown[]
            }>(messageKeys.list(message.conversationId), (history) => {
              if (!history) return history

              const receivedMessage: ChatMessage = {
                _id: message._id!,
                sender: message.sender!,
                text,
                createdAt: message.createdAt!,
              }
              const exists = history.pages.some((page) =>
                page.data.some(
                  (cachedMessage) => cachedMessage._id === message._id
                )
              )

              if (exists) return history

              return {
                ...history,
                pages: history.pages.map((page, index) =>
                  index === 0
                    ? { ...page, data: [receivedMessage, ...page.data] }
                    : page
                ),
              }
            })
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
        if (active) setSocket(activeSocket)
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

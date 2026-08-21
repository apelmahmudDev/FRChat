"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { io, type Socket } from "socket.io-client"

import { getSocketToken } from "@/features/auth/api/auth"
import {
  conversationKeys,
  messageKeys,
} from "@/features/messages/api/query-keys"
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
        transports: ["websocket"],
        reconnection: true,
      })

      activeSocket.on("message:new", (payload) => {
        const parsedMessage = socketMessageEventSchema.safeParse(payload)

        void queryClient.invalidateQueries({ queryKey: conversationKeys.all })

        if (parsedMessage.success) {
          void queryClient.invalidateQueries({
            queryKey: messageKeys.list(parsedMessage.data.conversationId),
          })
        }
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

      setSocket(activeSocket)
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

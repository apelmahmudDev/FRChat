"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { io, type Socket } from "socket.io-client"

import { getSocketToken } from "@/features/auth/api/auth.api"
import { conversationKeys } from "@/features/conversations/api/conversations.keys"
import { messageKeys } from "@/features/messages/api/messages.keys"
import { upsertReceivedMessage } from "@/features/messages/lib/message-cache"
import type {
  ChatMessage,
  MessageHistory,
} from "@/features/messages/types/message.types"
import { socketMessageEventSchema } from "@/features/realtime/schemas/socket-event.schema"
import { clientEnv } from "@/lib/env/client"

type ServerToClientEvents = {
  "message:new": (payload: unknown) => void
  "conversation:updated": (payload: unknown) => void
}

type ChatSocket = Socket<ServerToClientEvents>

export function SocketProvider({ children }: React.PropsWithChildren) {
  const queryClient = useQueryClient()

  useEffect(() => {
    let active = true
    let activeSocket: ChatSocket | undefined
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined
    let reconnectAttempts = 0

    function scheduleFreshConnection() {
      if (!active || reconnectTimer) return

      const delay = Math.min(1_000 * 2 ** reconnectAttempts, 30_000)
      reconnectAttempts += 1
      reconnectTimer = setTimeout(() => {
        reconnectTimer = undefined
        void connect()
      }, delay)
    }

    async function connect() {
      if (!active || activeSocket) return

      let token: string
      try {
        const socketToken = await getSocketToken()
        token = socketToken.token
      } catch (error) {
        console.error("Unable to get a chat socket token", error)
        scheduleFreshConnection()
        return
      }

      if (!active) return

      const socket: ChatSocket = io(clientEnv.NEXT_PUBLIC_CHAT_SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
      })
      activeSocket = socket

      socket.on("message:new", (payload) => {
        const parsedMessage = socketMessageEventSchema.safeParse(payload)
        if (!parsedMessage.success) {
          console.warn(
            "Ignoring an invalid message:new event",
            parsedMessage.error
          )
          return
        }

        const message = parsedMessage.data
        const text = message.text ?? message.content
        void queryClient.invalidateQueries({ queryKey: conversationKeys.all })

        if (
          !message._id ||
          !message.sender ||
          text === undefined ||
          !message.createdAt
        ) {
          void queryClient.invalidateQueries({
            queryKey: messageKeys.list(message.conversationId),
          })
          return
        }

        const receivedMessage: ChatMessage = {
          _id: message._id,
          sender: message.sender,
          text,
          createdAt: message.createdAt,
        }

        queryClient.setQueryData<MessageHistory>(
          messageKeys.list(message.conversationId),
          (history) => upsertReceivedMessage(history, receivedMessage)
        )
      })

      socket.on("connect_error", (error) => {
        console.error("Chat socket connection failed", error.message)

        // Socket.IO retries transport failures itself. Authentication and
        // server middleware failures require a new socket with a fresh token.
        if (!socket.active && activeSocket === socket) {
          socket.disconnect()
          activeSocket = undefined
          scheduleFreshConnection()
        }
      })

      socket.on("conversation:updated", () => {
        void queryClient.invalidateQueries({ queryKey: conversationKeys.all })
      })

      socket.on("connect", () => {
        if (!active) return

        reconnectAttempts = 0

        // Recover messages that may have arrived while this browser was offline.
        void queryClient.invalidateQueries({ queryKey: messageKeys.all })
        void queryClient.invalidateQueries({ queryKey: conversationKeys.all })
      })

      socket.on("disconnect", (reason) => {
        if (reason === "io server disconnect" && activeSocket === socket) {
          activeSocket = undefined
          scheduleFreshConnection()
        }
      })
    }

    void connect()

    return () => {
      active = false
      if (reconnectTimer) clearTimeout(reconnectTimer)
      activeSocket?.disconnect()
    }
  }, [queryClient])

  return children
}

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle, Send } from "lucide-react"

import { IconTooltip } from "@/components/ui/icon-tooltip"
import { toast } from "@/components/ui/toast"
import { sendMessage } from "@/features/messages/api/messages.api"
import { currentSessionQueryOptions } from "@/features/auth/api/auth.queries"
import { conversationKeys } from "@/features/conversations/api/conversations.keys"
import { messageKeys } from "@/features/messages/api/messages.keys"
import type {
  ChatMessage,
  MessageHistory,
} from "@/features/messages/types/message.types"

type MessageInputProps = {
  conversationId: string
  conversationName: string
}

export default function MessageInput({
  conversationId,
  conversationName,
}: MessageInputProps) {
  const [text, setText] = useState("")
  const queryClient = useQueryClient()
  const sessionQuery = useQuery(currentSessionQueryOptions())
  const sendMutation = useMutation<
    void,
    Error,
    { text: string },
    { previousHistory: MessageHistory | undefined }
  >({
    mutationFn: async ({ text }) => {
      await sendMessage({ conversationId, text })
    },
    onMutate: async ({ text }) => {
      await queryClient.cancelQueries({
        queryKey: messageKeys.list(conversationId),
      })

      const queryKey = messageKeys.list(conversationId)
      const previousHistory = queryClient.getQueryData<MessageHistory>(queryKey)
      const optimisticMessage: ChatMessage = {
        _id: `optimistic-${crypto.randomUUID()}`,
        sender: sessionQuery.data?.user._id ?? "pending-user",
        text,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData<MessageHistory>(queryKey, (history) => {
        if (!history) {
          return {
            pages: [
              { data: [optimisticMessage], nextCursor: null, hasMore: false },
            ],
            pageParams: [undefined],
          }
        }

        return {
          ...history,
          pages: history.pages.map((page, index) =>
            index === 0
              ? { ...page, data: [optimisticMessage, ...page.data] }
              : page
          ),
        }
      })

      return { previousHistory }
    },
    onSuccess: () => {
      setText("")
      void queryClient.invalidateQueries({
        queryKey: messageKeys.list(conversationId),
      })
      void queryClient.invalidateQueries({ queryKey: conversationKeys.all })
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(
          messageKeys.list(conversationId),
          context.previousHistory
        )
      } else {
        queryClient.removeQueries({
          queryKey: messageKeys.list(conversationId),
          exact: true,
        })
      }
      toast.add({
        title: "Message not sent",
        description: error.message,
        type: "error",
      })
    },
  })

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = text.trim()
    if (message) sendMutation.mutate({ text: message })
  }

  return (
    <footer className="shrink-0 bg-background px-4 pb-4 sm:px-7 sm:pb-6">
      <form
        onSubmit={submit}
        className="mx-auto max-w-3xl rounded-2xl border bg-card p-3 shadow-xs focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10"
      >
        <label htmlFor="message" className="sr-only">
          Message {conversationName}
        </label>
        <textarea
          id="message"
          rows={2}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          disabled={sendMutation.isPending}
          placeholder={`Message ${conversationName}`}
          className="max-h-32 min-h-12 w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex justify-end">
          <IconTooltip label="Send message" side="top">
            <button
              type="submit"
              aria-label="Send message"
              disabled={sendMutation.isPending || text.trim().length === 0}
              className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              {sendMutation.isPending ? (
                <LoaderCircle className="size-[18px] animate-spin" />
              ) : (
                <Send className="size-[18px]" />
              )}
            </button>
          </IconTooltip>
        </div>
      </form>
    </footer>
  )
}

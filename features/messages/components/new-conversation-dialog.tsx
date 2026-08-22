"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle, MessageSquarePlus, X } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { createConversation } from "@/features/conversations/api/conversations.api"
import { conversationKeys } from "@/features/conversations/api/conversations.keys"
import { userSearchQueryOptions } from "@/features/users/api/users.queries"

type NewConversationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NewConversationDialog({
  open,
  onOpenChange,
}: NewConversationDialogProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [userId, setUserId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const userSearch = useQuery(userSearchQueryOptions(userId.trim()))

  const mutation = useMutation({
    mutationFn: (userId: string) => createConversation({ userId }),
    onSuccess: async (conversation) => {
      await queryClient.invalidateQueries({ queryKey: conversationKeys.all })
      onOpenChange(false)
      setUserId("")
      setError(null)
      toast.add({ title: "Conversation started", type: "success" })
      router.push(`/messages/${conversation._id}`)
    },
    onError: (mutationError: Error) => {
      setError(mutationError.message)
    },
  })

  if (!open) return null

  function close() {
    if (!mutation.isPending) {
      setError(null)
      onOpenChange(false)
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedUserId = userId.trim()

    if (!normalizedUserId) {
      setError("Enter the user ID of the person you want to message.")
      return
    }

    setError(null)
    mutation.mutate(normalizedUserId)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4"
      role="presentation"
      onMouseDown={close}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-conversation-title"
        className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquarePlus className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="new-conversation-title" className="text-base font-semibold">
              New conversation
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search by name or phone, then choose the recipient for a direct
              chat.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close new conversation dialog"
            onClick={close}
            disabled={mutation.isPending}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form className="mt-6 space-y-4" noValidate onSubmit={submit}>
          <div>
            <label
              htmlFor="new-conversation-user-id"
              className="text-sm font-medium"
            >
              Find a person
            </label>
            <input
              id="new-conversation-user-id"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              autoFocus
              autoComplete="off"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "new-conversation-error" : undefined}
              disabled={mutation.isPending}
              placeholder="Name, phone, or user ID"
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 font-mono text-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {error && (
              <p
                id="new-conversation-error"
                className="mt-2 text-sm text-destructive"
              >
                {error}
              </p>
            )}
            {userSearch.isError && (
              <p className="mt-2 text-sm text-destructive">
                {userSearch.error.message}
              </p>
            )}
            {userSearch.data && userSearch.data.data.length > 0 && (
              <ul className="mt-2 max-h-40 overflow-y-auto rounded-lg border bg-background p-1">
                {userSearch.data.data.map((user) => (
                  <li key={user._id}>
                    <button
                      type="button"
                      onClick={() => {
                        setUserId(user._id)
                        setError(null)
                      }}
                      className="flex w-full flex-col rounded-md px-3 py-2 text-left transition hover:bg-muted"
                    >
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.phone}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              disabled={mutation.isPending}
              className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {mutation.isPending && (
                <LoaderCircle className="size-4 animate-spin" />
              )}
              {mutation.isPending ? "Starting..." : "Start chat"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

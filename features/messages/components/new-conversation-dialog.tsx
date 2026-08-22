"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle, MessageSquarePlus, X } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { createConversation } from "@/features/conversations/api/conversations.api"
import { conversationKeys } from "@/features/conversations/api/conversations.keys"
import { UserSearchPicker } from "@/features/users/components/user-search-picker"
import type { ChatUser } from "@/features/users/types/user.types"

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
  const [selectedUsers, setSelectedUsers] = useState<ChatUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const selectedUser = selectedUsers[0]

  const mutation = useMutation({
    mutationFn: (userId: string) => createConversation({ userId }),
    onSuccess: async (conversation) => {
      await queryClient.invalidateQueries({ queryKey: conversationKeys.all })
      onOpenChange(false)
      setSelectedUsers([])
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
      setSelectedUsers([])
      setError(null)
      mutation.reset()
      onOpenChange(false)
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedUser) {
      setError("Choose a person from the search results first.")
      return
    }

    setError(null)
    mutation.mutate(selectedUser._id)
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
            <UserSearchPicker
              id="new-conversation-user-id"
              selectedUsers={selectedUsers}
              onSelectionChange={(users) => {
                setSelectedUsers(users)
                setError(null)
              }}
              disabled={mutation.isPending}
            />
            {error && (
              <p
                id="new-conversation-error"
                className="mt-2 text-sm text-destructive"
              >
                {error}
              </p>
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
              disabled={mutation.isPending || !selectedUser}
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

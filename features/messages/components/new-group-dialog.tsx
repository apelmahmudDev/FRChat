"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle, Users, X } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { createGroup } from "@/features/conversations/api/conversations.api"
import { conversationKeys } from "@/features/conversations/api/conversations.keys"
import { UserSearchPicker } from "@/features/users/components/user-search-picker"
import type { ChatUser } from "@/features/users/types/user.types"

type NewGroupDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NewGroupDialog({
  open,
  onOpenChange,
}: NewGroupDialogProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<ChatUser[]>([])
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      createGroup({
        name: name.trim(),
        participantIds: selectedUsers.map(({ _id }) => _id),
      }),
    onSuccess: async ({ _id }) => {
      await queryClient.invalidateQueries({ queryKey: conversationKeys.all })
      toast.add({ title: "Group created", type: "success" })
      resetDialog()
      onOpenChange(false)
      router.push(`/messages/${_id}`)
    },
    onError: (mutationError: Error) => setError(mutationError.message),
  })

  if (!open) return null

  function resetDialog() {
    setName("")
    setSelectedUsers([])
    setError(null)
    mutation.reset()
  }

  function close() {
    if (mutation.isPending) return
    resetDialog()
    onOpenChange(false)
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) {
      setError("Enter a group name.")
      return
    }

    if (selectedUsers.length === 0) {
      setError("Select at least one group member.")
      return
    }

    setError(null)
    mutation.mutate()
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
        aria-labelledby="new-group-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="flex max-h-[min(720px,calc(100svh-2rem))] w-full max-w-lg flex-col rounded-2xl border bg-card shadow-xl"
      >
        <div className="flex items-start gap-4 border-b p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="new-group-title" className="text-base font-semibold">
              Create group
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Name the group and search for the people you want to include.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close create group dialog"
            onClick={close}
            disabled={mutation.isPending}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          noValidate
          onSubmit={submit}
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
            <div>
              <label htmlFor="new-group-name" className="text-sm font-medium">
                Group name
              </label>
              <input
                id="new-group-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  setError(null)
                }}
                autoFocus
                maxLength={100}
                disabled={mutation.isPending}
                placeholder="Enter a group name"
                className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <UserSearchPicker
              id="new-group-member-search"
              selectedUsers={selectedUsers}
              onSelectionChange={(users) => {
                setSelectedUsers(users)
                setError(null)
              }}
              disabled={mutation.isPending}
              multiple
              maxSelections={100}
            />

            <p className="text-xs text-muted-foreground">
              {selectedUsers.length === 0
                ? "No members selected yet."
                : `${selectedUsers.length} member${selectedUsers.length === 1 ? "" : "s"} selected.`}
            </p>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t p-4 sm:px-6">
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
              disabled={
                mutation.isPending ||
                name.trim().length === 0 ||
                selectedUsers.length === 0
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending && (
                <LoaderCircle className="size-4 animate-spin" />
              )}
              {mutation.isPending ? "Creating..." : "Create group"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

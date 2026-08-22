"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/toast"
import { createGroup } from "@/features/messages/api/messaging"
import { conversationKeys } from "@/features/messages/api/query-keys"

export default function NewGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [memberIds, setMemberIds] = useState("")
  const [error, setError] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: () =>
      createGroup(name.trim(), memberIds.split(/[\s,]+/).filter(Boolean)),
    onSuccess: async ({ _id }) => {
      await queryClient.invalidateQueries({ queryKey: conversationKeys.all })
      toast.add({ title: "Group created", type: "success" })
      onOpenChange(false)
      router.push(`/messages/${_id}`)
    },
    onError: (mutationError: Error) => setError(mutationError.message),
  })
  if (!open) return null
  function close() {
    if (!mutation.isPending) {
      setError(null)
      onOpenChange(false)
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4"
      onMouseDown={close}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-group-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl"
      >
        <h2 id="new-group-title" className="text-base font-semibold">
          Create group
        </h2>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!name.trim() || !memberIds.trim()) {
              setError("Enter a group name and at least one member ID.")
              return
            }
            setError(null)
            mutation.mutate()
          }}
          className="mt-5 space-y-4"
        >
          <label className="block text-sm font-medium">
            Group name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={mutation.isPending}
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <label className="block text-sm font-medium">
            Member user IDs
            <input
              value={memberIds}
              onChange={(event) => setMemberIds(event.target.value)}
              disabled={mutation.isPending}
              placeholder="Separate IDs with commas"
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/15"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              disabled={mutation.isPending}
              className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {mutation.isPending ? "Creating..." : "Create group"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

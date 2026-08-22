"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Crown, LoaderCircle, UserMinus, UserPlus } from "lucide-react"

import { toast } from "@/components/ui/toast"
import {
  addParticipants,
  promoteAdmin,
  removeParticipant,
  renameGroup,
} from "@/features/messages/api/messaging"
import { conversationKeys } from "@/features/messages/api/query-keys"
import type { Conversation } from "@/features/messages/data/conversations"

export default function GroupManagement({
  conversation,
}: {
  conversation: Conversation
}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [name, setName] = useState(conversation.name)
  const [memberIds, setMemberIds] = useState("")
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: conversationKeys.all })
    router.refresh()
  }
  const showError = (error: Error) =>
    toast.add({
      title: "Group update failed",
      description: error.message,
      type: "error",
    })
  const renameMutation = useMutation({
    mutationFn: () => renameGroup(conversation.id, name.trim()),
    onSuccess: refresh,
    onError: showError,
  })
  const addMutation = useMutation({
    mutationFn: () =>
      addParticipants(
        conversation.id,
        memberIds.split(/[\s,]+/).filter(Boolean)
      ),
    onSuccess: async () => {
      setMemberIds("")
      await refresh()
      toast.add({ title: "Members added", type: "success" })
    },
    onError: showError,
  })
  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeParticipant(conversation.id, userId),
    onSuccess: refresh,
    onError: showError,
  })
  const promoteMutation = useMutation({
    mutationFn: (userId: string) => promoteAdmin(conversation.id, userId),
    onSuccess: refresh,
    onError: showError,
  })

  return (
    <section className="space-y-4 border-b px-6 py-5">
      <h3 className="text-sm font-semibold">Manage group</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (name.trim()) renameMutation.mutate()
        }}
        className="flex gap-2"
      >
        <input
          aria-label="Group name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={renameMutation.isPending}
          className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/15"
        />
        <button
          type="submit"
          disabled={
            renameMutation.isPending || name.trim() === conversation.name
          }
          className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
        >
          Rename
        </button>
      </form>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (memberIds.trim()) addMutation.mutate()
        }}
        className="space-y-2"
      >
        <label htmlFor="group-members" className="text-xs font-medium">
          Add members by user ID
        </label>
        <div className="flex gap-2">
          <input
            id="group-members"
            value={memberIds}
            onChange={(event) => setMemberIds(event.target.value)}
            disabled={addMutation.isPending}
            placeholder="Separate IDs with commas"
            className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/15"
          />
          <button
            type="submit"
            disabled={addMutation.isPending || !memberIds.trim()}
            aria-label="Add members"
            className="rounded-lg bg-muted px-3 text-foreground disabled:opacity-50"
          >
            {addMutation.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
          </button>
        </div>
      </form>
      {conversation.participants && (
        <ul className="space-y-2">
          {conversation.participants.map((member) => (
            <li key={member.id} className="flex items-center gap-2 text-xs">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {member.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate">{member.name}</span>
              <button
                type="button"
                onClick={() => promoteMutation.mutate(member.id)}
                disabled={promoteMutation.isPending}
                aria-label={`Promote ${member.name} to admin`}
                className="rounded p-1 text-muted-foreground hover:bg-muted"
              >
                <Crown className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeMutation.mutate(member.id)}
                disabled={removeMutation.isPending}
                aria-label={`Remove ${member.name}`}
                className="rounded p-1 text-destructive hover:bg-destructive/10"
              >
                <UserMinus className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

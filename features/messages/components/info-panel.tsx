import { Sprout, X } from "lucide-react"

import { IconTooltip } from "@/components/ui/icon-tooltip"
import type { Conversation } from "@/features/conversations/types/conversation.types"

import GroupManagement from "./group-management"

type InfoPanelProps = { conversation: Conversation; onClose: () => void }

export default function InfoPanel({ conversation, onClose }: InfoPanelProps) {
  return (
    <aside className="absolute inset-y-0 right-0 z-30 flex w-[min(310px,90vw)] shrink-0 flex-col overflow-y-auto border-l bg-card shadow-xl 2xl:static 2xl:w-[310px] 2xl:shadow-none">
      <div className="flex h-[82px] shrink-0 items-center justify-between border-b px-6">
        <h2 className="text-sm font-semibold">About this conversation</h2>
        <IconTooltip label="Close details" side="left">
          <button
            type="button"
            aria-label="Close information panel"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full transition hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </IconTooltip>
      </div>
      <div className="border-b px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
            {conversation.initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold">{conversation.name}</h3>
              {conversation.type === "group" && (
                <Sprout className="size-4 text-primary" />
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {conversation.members
                ? `${conversation.members} members`
                : "Direct message"}
            </p>
          </div>
        </div>
      </div>
      <section className="border-b px-6 py-5">
        <h3 className="text-sm font-semibold">
          {conversation.type === "group"
            ? `Members (${conversation.members ?? 0})`
            : "Contact"}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {conversation.participants?.map((member) => (
            <span
              key={member.id}
              title={`${member.name} - ${member.phone}`}
              className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary"
            >
              {member.name.slice(0, 2).toUpperCase()}
            </span>
          ))}
        </div>
      </section>
      {conversation.type === "group" && (
        <GroupManagement conversation={conversation} />
      )}
    </aside>
  )
}

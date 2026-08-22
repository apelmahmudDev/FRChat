"use client"

import { useState } from "react"
import Link from "next/link"

import {
  Building2,
  Check,
  MessageCircleMore,
  MessageSquarePlus,
  Search,
  SlidersHorizontal,
  Sprout,
  Users,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconTooltip } from "@/components/ui/icon-tooltip"
import type { Conversation } from "@/features/messages/data/conversations"

const avatarColors = [
  "bg-emerald-100 text-emerald-800",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-800",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
]

const filters = ["All", "Unread", "Direct", "Groups"] as const

type ConversationFilter = (typeof filters)[number]

type ConversationListProps = {
  conversations: readonly Conversation[]
  selectedConversationId?: string | null
}

export default function ConversationList({
  conversations,
  selectedConversationId,
}: ConversationListProps) {
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("All")
  const [searchTerm, setSearchTerm] = useState("")

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  const filteredConversations = conversations.filter((conversation) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Unread" && Boolean(conversation.unread)) ||
      (activeFilter === "Groups" && Boolean(conversation.group)) ||
      (activeFilter === "Direct" && !conversation.group)
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      conversation.name.toLowerCase().includes(normalizedSearchTerm) ||
      conversation.preview.toLowerCase().includes(normalizedSearchTerm)

    return matchesFilter && matchesSearch
  })

  const isEmptyList = conversations.length === 0
  const isNoResults = !isEmptyList && filteredConversations.length === 0
  const emptyTitle = isEmptyList
    ? "No conversations yet"
    : "No conversations found"
  const emptyDescription = isEmptyList
    ? "Start a new chat and it will appear here."
    : normalizedSearchTerm
      ? "Try a different search term or clear the filter."
      : "Try a different filter to surface more conversations."

  return (
    <aside className="hidden w-[350px] shrink-0 flex-col border-r bg-card lg:flex">
      <div className="space-y-3 border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MessageCircleMore className="size-5" />
            </span>
            <span className="text-xl font-bold tracking-tight">FRChat</span>
          </div>
          <DropdownMenu>
            <IconTooltip label="Filter conversations">
              <DropdownMenuTrigger
                aria-label="Filter conversations"
                className="ml-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-muted transition hover:bg-muted/80 data-popup-open:bg-primary/10 data-popup-open:text-primary"
              >
                <SlidersHorizontal className="size-4" />
              </DropdownMenuTrigger>
            </IconTooltip>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-56 p-2"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-2 text-xs font-semibold text-foreground">
                  Filter conversations
                </DropdownMenuLabel>
                {filters.map((filter) => (
                  <DropdownMenuItem
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className="h-9 px-2.5"
                  >
                    <span>
                      {filter === "All" ? "All conversations" : filter}
                    </span>
                    {activeFilter === filter && (
                      <Check className="ml-auto size-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="h-9 px-2.5 text-primary">
                <MessageSquarePlus className="size-4" />
                New conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <label className="flex h-10 w-full items-center gap-2 rounded-full bg-muted px-3.5 focus-within:ring-2 focus-within:ring-primary/15">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search conversations"
            aria-label="Search conversations"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      <nav className="flex h-16 items-center gap-1 border-b px-5 text-xs font-medium">
        {filters.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`rounded-lg px-4 py-2 transition ${activeFilter === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-1 pt-3 pb-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation, index) => (
            <Link
              href={`/messages/${conversation.id}`}
              scroll={false}
              key={conversation.id}
              aria-current={
                selectedConversationId === conversation.id ? "page" : undefined
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition ${selectedConversationId === conversation.id ? "bg-primary/8" : "hover:bg-muted/70"}`}
            >
              <span
                className={`relative flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColors[index % avatarColors.length]}`}
              >
                {conversation.group ? (
                  <Users className="size-5" />
                ) : conversation.company ? (
                  <Building2 className="size-5" />
                ) : (
                  conversation.initials
                )}
                {index < 2 && (
                  <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-semibold">
                    {conversation.name}
                  </span>
                  {conversation.group && (
                    <Sprout className="size-3.5 shrink-0 text-primary" />
                  )}
                  <span className="ml-auto shrink-0 text-[11px] font-normal text-muted-foreground">
                    {conversation.time}
                  </span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {conversation.preview}
                  </span>
                  {conversation.unread && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
                      {conversation.unread}
                    </span>
                  )}
                </span>
              </span>
            </Link>
          ))
        ) : (
          <div className="flex min-h-[50svh] flex-col items-center justify-center px-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageCircleMore className="size-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">{emptyTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {emptyDescription}
            </p>
            {isNoResults && (
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All")
                  setSearchTerm("")
                }}
                className="mt-4 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary/15"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

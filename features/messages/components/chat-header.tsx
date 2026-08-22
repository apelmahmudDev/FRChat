import { ChevronDown, Info, LogOut, Sprout } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

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
import { toast } from "@/components/ui/toast"
import { logout } from "@/features/auth/api/auth.api"
import { authKeys } from "@/features/auth/api/auth.keys"
import { currentSessionQueryOptions } from "@/features/auth/api/auth.queries"
import type { Conversation } from "@/features/conversations/types/conversation.types"

type ChatHeaderProps = {
  conversation: Conversation
  isInfoPanelOpen: boolean
  onInfoPanelToggle: () => void
}

export default function ChatHeader({
  conversation,
  isInfoPanelOpen,
  onInfoPanelToggle,
}: ChatHeaderProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useQuery(currentSessionQueryOptions())
  const logoutMutation = useMutation({
    mutationKey: [...authKeys.all, "logout"],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      router.replace("/sign-in")
      router.refresh()
    },
    onError: (error: Error) => {
      toast.add({
        title: "Unable to sign out",
        description: error.message,
        type: "error",
      })
    },
  })
  const profileName = session?.user.name ?? "Account"
  const profilePhone = session?.user.phone ?? "Signed in"
  const profileInitials = profileName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return (
    <header className="flex h-[82px] shrink-0 items-center justify-between border-b bg-card px-5 sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
          {conversation.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="truncate text-base font-semibold">
              {conversation.name}
            </h1>
            {conversation.type === "group" && (
              <Sprout className="size-4 text-primary" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {conversation.members
              ? `${conversation.members} members`
              : "Active now"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconTooltip
          label={`${isInfoPanelOpen ? "Close" : "Open"} conversation details`}
        >
          <button
            type="button"
            aria-label={`${isInfoPanelOpen ? "Close" : "Open"} conversation information`}
            aria-expanded={isInfoPanelOpen}
            onClick={onInfoPanelToggle}
            className={`flex size-11 items-center justify-center rounded-full transition ${
              isInfoPanelOpen
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary hover:bg-primary/15"
            }`}
          >
            <Info className="size-[18px]" />
          </button>
        </IconTooltip>
        <DropdownMenu>
          <IconTooltip label="Account menu">
            <DropdownMenuTrigger
              aria-label="Open profile menu"
              className="group relative ml-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-xs font-bold text-white shadow-sm ring-2 ring-background transition hover:ring-primary/25 data-popup-open:ring-primary/30"
            >
              {profileInitials}
              <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-card bg-emerald-400" />
              <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-muted text-foreground shadow-sm">
                <ChevronDown className="size-3" />
              </span>
            </DropdownMenuTrigger>
          </IconTooltip>
          <DropdownMenuContent align="end" sideOffset={10} className="w-64 p-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2.5">
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-xs font-bold text-white">
                  {profileInitials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {profileName}
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {profilePhone}
                  </span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
              className="h-10 px-2.5"
            >
              <LogOut className="size-4" />
              {logoutMutation.isPending ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

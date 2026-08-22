"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ChevronDown,
  LoaderCircle,
  LogOut,
  MessageCircleMore,
  UserRound,
} from "lucide-react"
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
import { toast } from "@/components/ui/toast"
import { logout } from "@/features/auth/api/auth.api"
import { authKeys } from "@/features/auth/api/auth.keys"
import { currentSessionQueryOptions } from "@/features/auth/api/auth.queries"

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

export default function ProfileMenu() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, isPending: isSessionPending } = useQuery(
    currentSessionQueryOptions()
  )
  const logoutMutation = useMutation({
    mutationKey: [...authKeys.all, "logout"],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      toast.add({
        title: "Signed out",
        description: "You have been securely signed out.",
        type: "success",
      })
      router.replace("/")
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
  const profilePhone =
    session?.user.phone ??
    (isSessionPending ? "Loading profile..." : "Signed in")
  const profileInitials = session ? getInitials(session.user.name) : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Open profile menu for ${profileName}`}
        className="group flex h-10 max-w-44 items-center gap-2 rounded-full border border-[#173a2a]/10 bg-white/70 p-1 text-[#20342a] transition-colors hover:border-[#0a8f55]/30 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a8f55] data-popup-open:border-[#0a8f55]/30 data-popup-open:bg-white sm:pr-2.5 dark:border-white/10 dark:bg-white/5 dark:text-[#e4eee8] dark:hover:bg-white/10 dark:data-popup-open:bg-white/10"
      >
        <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#12aa68] to-[#087a49] text-[11px] font-extrabold text-white">
          {profileInitials ?? (
            <UserRound aria-hidden="true" className="size-4" />
          )}
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-[#c9f35b] dark:border-[#132019]" />
        </span>
        <span className="hidden max-w-24 min-w-0 truncate text-xs font-bold xl:block">
          {profileName}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="hidden size-3.5 shrink-0 text-[#708078] transition-transform group-data-popup-open:rotate-180 sm:block dark:text-[#91a198]"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-68 rounded-2xl p-2"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 rounded-xl px-2 py-2.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#12aa68] to-[#087a49] text-xs font-extrabold text-white">
              {profileInitials ?? (
                <UserRound aria-hidden="true" className="size-[18px]" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-foreground">
                {profileName}
              </span>
              <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                {profilePhone}
              </span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/messages")}
            className="h-10 gap-2.5 px-2.5 font-semibold"
          >
            <MessageCircleMore className="size-4 text-[#0a8f55]" />
            Open messages
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={logoutMutation.isPending}
            aria-busy={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            className="h-10 gap-2.5 px-2.5 font-semibold"
          >
            {logoutMutation.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

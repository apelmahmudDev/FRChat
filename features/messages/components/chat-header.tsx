import {
  ChevronDown,
  CircleUserRound,
  Info,
  LogOut,
  Phone,
  Settings,
  Sprout,
  Video,
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

type ChatHeaderProps = {
  isInfoPanelOpen: boolean
  onInfoPanelToggle: () => void
}

export default function ChatHeader({
  isInfoPanelOpen,
  onInfoPanelToggle,
}: ChatHeaderProps) {
  return (
    <header className="flex h-[82px] shrink-0 items-center justify-between border-b bg-card px-5 sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
          PT
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="truncate text-base font-semibold">Product Team</h1>
            <Sprout className="size-4 text-primary" />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">12 members</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden overflow-hidden rounded-xl border sm:flex">
          <button
            type="button"
            aria-label="Start voice call"
            className="flex size-11 items-center justify-center transition hover:bg-muted"
          >
            <Phone className="size-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Start video call"
            className="flex size-11 items-center justify-center border-l transition hover:bg-muted"
          >
            <Video className="size-[18px]" />
          </button>
        </div>
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
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open profile menu"
            className="group relative ml-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-xs font-bold text-white shadow-sm ring-2 ring-background transition hover:ring-primary/25 data-popup-open:ring-primary/30"
          >
            AL
            <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-card bg-emerald-400" />
            <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-muted text-foreground shadow-sm">
              <ChevronDown className="size-3" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10} className="w-64 p-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2.5">
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-xs font-bold text-white">
                  AL
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    Ada Lovelace
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    +1 555 123 4567
                  </span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="h-10 px-2.5">
              <CircleUserRound className="size-4" />
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem className="h-10 px-2.5">
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="h-10 px-2.5">
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

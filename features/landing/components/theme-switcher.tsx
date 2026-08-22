"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

type ThemeName = (typeof themeOptions)[number]["value"]

function isThemeName(value: unknown): value is ThemeName {
  return themeOptions.some((option) => option.value === value)
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const selectedTheme = isThemeName(theme) ? theme : "system"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Choose color theme"
        className="flex size-10 items-center justify-center rounded-full border border-[#173a2a]/10 bg-white/70 text-[#294338] transition-colors hover:border-[#0a8f55]/30 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a8f55] dark:border-white/10 dark:bg-white/5 dark:text-[#dbe8e0] dark:hover:bg-white/10"
      >
        <Sun className="size-[17px] dark:hidden" />
        <Moon className="hidden size-[17px] dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-44 rounded-xl p-1.5"
      >
        <DropdownMenuRadioGroup
          value={selectedTheme}
          onValueChange={(value: unknown) => {
            if (isThemeName(value)) setTheme(value)
          }}
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase">
            Appearance
          </DropdownMenuLabel>
          {themeOptions.map((option) => {
            const Icon = option.icon

            return (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                closeOnClick
                className="h-9 gap-2 px-2.5 font-semibold"
              >
                <Icon className="size-4 text-muted-foreground" />
                {option.label}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

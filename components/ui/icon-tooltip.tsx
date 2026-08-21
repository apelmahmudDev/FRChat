"use client"

import type { ReactElement } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type IconTooltipProps = {
  children: ReactElement
  label: string
  side?: "top" | "right" | "bottom" | "left"
}

function IconTooltip({ children, label, side = "bottom" }: IconTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  )
}

export { IconTooltip }

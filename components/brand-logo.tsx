import { MessageCircleMore } from "lucide-react"

import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  inverse?: boolean
}

export default function BrandLogo({
  className,
  inverse = false,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-9 items-center justify-center rounded-[13px] bg-[#0a8f55] text-white shadow-[0_7px_18px_rgba(10,143,85,0.18)]">
        <MessageCircleMore
          aria-hidden="true"
          className="size-5"
          strokeWidth={2.2}
        />
        <span
          aria-hidden="true"
          className={cn(
            "absolute -right-1 -bottom-1 size-3 rounded-full border-2 bg-[#c9f35b]",
            inverse
              ? "border-[#123829]"
              : "border-[#f7f8f2] dark:border-[#0b1510]"
          )}
        />
      </span>
      <span
        className={cn(
          "text-[1.1rem] font-extrabold tracking-[-0.04em]",
          inverse ? "text-white" : "text-[#14251d] dark:text-[#eef8f1]"
        )}
      >
        FR
        <span
          className={
            inverse ? "text-[#7ee2a4]" : "text-[#0a8f55] dark:text-[#60d78d]"
          }
        >
          Chat
        </span>
      </span>
    </span>
  )
}

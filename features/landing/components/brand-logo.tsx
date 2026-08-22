import { MessageCircleMore } from "lucide-react"

type BrandLogoProps = {
  compact?: boolean
  inverse?: boolean
}

export default function BrandLogo({
  compact = false,
  inverse = false,
}: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="FRChat home">
      <span className="relative flex size-9 items-center justify-center rounded-[13px] bg-[#0a8f55] text-white shadow-[0_8px_24px_rgba(10,143,85,0.2)]">
        <MessageCircleMore className="size-5" strokeWidth={2.2} />
        <span className="absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-[#f7f8f2] bg-[#c9f35b] dark:border-[#0b1510]" />
      </span>
      {!compact && (
        <span
          className={`text-[1.1rem] font-extrabold tracking-[-0.04em] ${
            inverse ? "text-white" : "text-[#14251d] dark:text-[#eef8f1]"
          }`}
        >
          FR
          <span className={inverse ? "text-[#c9f35b]" : "text-[#0a8f55]"}>
            Chat
          </span>
        </span>
      )}
    </span>
  )
}

import { MessageCircleMore } from "lucide-react"

export default function BrandLogo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative flex size-9 items-center justify-center rounded-[13px] bg-[#0a8f55] text-white shadow-[0_8px_24px_rgba(10,143,85,0.2)]">
        <MessageCircleMore className="size-5" strokeWidth={2.2} />
        <span className="absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-[#f7f8f2] bg-[#c9f35b] dark:border-[#0b1510]" />
      </span>
      <span className="text-[1.1rem] font-extrabold tracking-[-0.04em] text-[#14251d] dark:text-[#eef8f1]">
        FR
        <span className="text-[#0a8f55] dark:text-[#60d78d]">Chat</span>
      </span>
    </span>
  )
}

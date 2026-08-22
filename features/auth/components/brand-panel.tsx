import Link from "next/link"
import { MessageCircleMore, ShieldCheck, Zap } from "lucide-react"

import BrandLogo from "@/components/brand-logo"

const highlights = [
  { icon: MessageCircleMore, label: "Direct and group conversations" },
  { icon: Zap, label: "Messages arrive in real time" },
  { icon: ShieldCheck, label: "Protected session access" },
] as const

export default function BrandPanel() {
  return (
    <section className="relative overflow-hidden bg-[#123829] px-6 py-6 text-white sm:px-8 sm:py-7 lg:flex lg:min-h-[600px] lg:flex-col lg:p-11">
      <div
        aria-hidden="true"
        className="landing-dot-grid absolute -top-16 -right-16 size-64 text-[#78e7a3]/22"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -left-24 size-80 rounded-full bg-[#61cb88]/18 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-28 size-72 rounded-full border border-white/8"
      />

      <div className="relative z-10">
        <Link
          href="/"
          aria-label="FRChat home"
          className="inline-flex rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7ee2a4]"
        >
          <BrandLogo inverse />
        </Link>

        <div className="mt-6 max-w-sm lg:mt-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-[#b9e9ca] uppercase">
            <span className="size-1.5 rounded-full bg-[#78e7a3]" />
            Calm, connected, current
          </p>
          <p className="mt-4 text-2xl leading-tight font-extrabold tracking-[-0.045em] text-balance sm:text-3xl lg:text-[2.75rem] lg:leading-[1.02]">
            Simple chats.
            <span className="block text-[#7ee2a4]">Closer teams.</span>
          </p>
          <p className="mt-5 hidden max-w-[360px] text-sm leading-6 text-white/62 lg:block">
            Find people, start a room, and stay with the conversation as new
            messages arrive.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-10 hidden space-y-2.5 lg:block">
        {highlights.map((highlight) => {
          const Icon = highlight.icon

          return (
            <div
              key={highlight.label}
              className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/6 px-4 py-3 text-sm font-semibold text-white/82 backdrop-blur-sm"
            >
              <span className="flex size-8 items-center justify-center rounded-xl bg-[#78e7a3]/12 text-[#7ee2a4]">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              {highlight.label}
            </div>
          )
        })}
      </div>

      <div className="relative z-10 mt-auto hidden items-center gap-2 pt-8 text-xs text-white/48 lg:flex">
        <span className="flex size-5 items-center justify-center rounded-full bg-white/7 text-[#7ee2a4]">
          <ShieldCheck aria-hidden="true" className="size-3" />
        </span>
        Secure conversations powered by FRChat
      </div>
    </section>
  )
}

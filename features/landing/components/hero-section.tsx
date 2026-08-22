import Link from "next/link"
import { ArrowDownRight, ArrowRight, Check, Sparkles } from "lucide-react"

import ChatPreview from "./chat-preview"

const guestReassurance = [
  "No registration detour",
  "Live message delivery",
  "Private session",
] as const

const memberReassurance = [
  "Session ready",
  "Live message delivery",
  "Private session",
] as const

const revealClassName =
  "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both ease-out motion-reduce:animate-none"

type HeroSectionProps = {
  hasSession: boolean
}

export default function HeroSection({ hasSession }: HeroSectionProps) {
  const chatHref = hasSession ? "/messages" : "/sign-in"
  const reassurance = hasSession ? memberReassurance : guestReassurance

  return (
    <section className="landing-hero-surface relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -top-16 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-[#c9f35b]/14 blur-3xl dark:bg-[#80be4d]/7"
      />
      <div
        aria-hidden="true"
        className="absolute top-52 left-[8%] size-[26rem] rounded-full bg-[#61cb88]/12 blur-3xl dark:bg-[#289a5e]/8"
      />
      <div
        aria-hidden="true"
        className="absolute top-52 right-[6%] size-[28rem] rounded-full bg-[#bde9cd]/25 blur-3xl dark:bg-[#17663c]/15"
      />
      <div
        aria-hidden="true"
        className="landing-dot-grid absolute top-44 -left-20 size-64 text-[#0a8f55]/22 dark:text-[#74d79a]/18"
      />
      <div
        aria-hidden="true"
        className="landing-dot-grid absolute top-72 -right-16 size-56 text-[#0a8f55]/18 dark:text-[#74d79a]/14"
      />

      <div className="relative mx-auto max-w-[1280px] px-5 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
        <div className="relative z-10 mx-auto max-w-[940px] text-center">
          <div
            className={`${revealClassName} inline-flex items-center gap-2 rounded-full border border-[#0a8f55]/15 bg-white/80 px-3 py-1.5 text-xs font-bold text-[#087348] shadow-sm backdrop-blur dark:border-[#74d79a]/20 dark:bg-[#101f18]/80 dark:text-[#82e0a5]`}
          >
            <Sparkles className="size-3.5" />
            {hasSession
              ? "Your conversations are ready"
              : "Conversations that keep up"}
          </div>
          <h1
            className={`${revealClassName} mt-6 text-[clamp(3.3rem,7vw,6.6rem)] leading-[0.94] font-extrabold tracking-[-0.07em] text-balance text-[#14251d] delay-75 dark:text-[#eef8f1]`}
          >
            <span className="block">Simple chats.</span>
            <span className="mt-2 block text-[#0a8f55] dark:text-[#60d78d]">
              Closer teams.
            </span>
          </h1>
          <p
            className={`${revealClassName} mx-auto mt-7 max-w-[720px] text-base leading-7 text-[#56675f] delay-150 sm:text-lg sm:leading-8 dark:text-[#a5b6ac]`}
          >
            Find people, start direct or group conversations, and stay in sync
            as messages arrive. FRChat keeps the whole exchange in one calm,
            focused place.
          </p>

          <div
            className={`${revealClassName} mt-8 flex flex-col justify-center gap-3 delay-200 sm:flex-row`}
          >
            <Link
              href={chatHref}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a8f55] px-6 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(10,143,85,0.22)] transition hover:-translate-y-0.5 hover:bg-[#087a49] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0a8f55]"
            >
              {hasSession ? "Open messages" : "Start a conversation"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#product"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#173a2a]/12 bg-white/75 px-6 text-sm font-extrabold text-[#20342a] transition hover:-translate-y-0.5 hover:border-[#0a8f55]/30 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0a8f55] dark:border-white/12 dark:bg-white/6 dark:text-[#e7f0ea] dark:hover:border-[#60d78d]/35 dark:hover:bg-white/10"
            >
              Explore the product
              <ArrowDownRight className="size-4 text-[#0a8f55] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
          </div>

          <ul
            className={`${revealClassName} mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 delay-200`}
          >
            {reassurance.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66766e] dark:text-[#9daea4]"
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-[#dbf3e4] text-[#087348] dark:bg-[#163a28] dark:text-[#70d99a]">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`${revealClassName} relative mx-auto mt-12 h-[290px] max-w-[1040px] overflow-hidden px-1 pt-6 delay-300 sm:mt-14 sm:h-[330px] sm:px-4 lg:h-[360px]`}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-[12%] top-12 h-56 rounded-full bg-[#75d599]/25 blur-3xl dark:bg-[#1d7948]/25"
          />
          <div className="relative z-10">
            <ChatPreview />
          </div>
          <div className="landing-preview-fade pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 sm:h-48" />
          <div className="absolute inset-x-0 bottom-5 z-30 flex items-center justify-center gap-3 text-[10px] font-extrabold tracking-[0.12em] text-white/75 uppercase sm:bottom-7 sm:gap-5 sm:text-[11px]">
            <span>Direct chats</span>
            <span className="size-1 rounded-full bg-[#78e7a3]" />
            <span>Groups</span>
            <span className="size-1 rounded-full bg-[#78e7a3]" />
            <span>Live updates</span>
          </div>
        </div>
      </div>
    </section>
  )
}

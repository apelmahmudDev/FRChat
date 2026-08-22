import Link from "next/link"
import { ArrowDownRight, ArrowRight, Check, Sparkles } from "lucide-react"

import ChatPreview from "./chat-preview"

const reassurance = [
  "No registration detour",
  "Live message delivery",
  "Private session",
] as const

const revealClassName =
  "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both ease-out motion-reduce:animate-none"

export default function HeroSection() {
  return (
    <section className="landing-hero-surface relative overflow-hidden">
      <div className="absolute top-16 left-[5%] size-[28rem] rounded-full bg-[#c9f35b]/15 blur-3xl dark:bg-[#80be4d]/8" />
      <div className="absolute top-16 right-[3%] size-[30rem] rounded-full bg-[#61cb88]/14 blur-3xl dark:bg-[#289a5e]/10" />
      <div className="landing-dot-grid absolute top-36 -left-16 size-64 text-[#0a8f55]/25 dark:text-[#74d79a]/20" />
      <div className="landing-dot-grid absolute -right-12 bottom-6 size-52 text-[#0a8f55]/20 dark:text-[#74d79a]/15" />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 px-5 pt-16 pb-20 sm:px-8 sm:pt-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 lg:px-10 lg:pt-24 lg:pb-24">
        <div className="relative z-10 max-w-[620px]">
          <div
            className={`${revealClassName} inline-flex items-center gap-2 rounded-full border border-[#0a8f55]/15 bg-white/80 px-3 py-1.5 text-xs font-bold text-[#087348] shadow-sm backdrop-blur dark:border-[#74d79a]/20 dark:bg-[#101f18]/80 dark:text-[#82e0a5]`}
          >
            <Sparkles className="size-3.5" />
            Conversations that keep up
          </div>
          <h1
            className={`${revealClassName} mt-6 text-[clamp(3.15rem,6vw,5.6rem)] leading-[0.96] font-extrabold tracking-[-0.065em] text-[#14251d] delay-75 dark:text-[#eef8f1]`}
          >
            Simple chats.
            <span className="mt-1 block text-[#0a8f55] dark:text-[#60d78d]">
              Closer teams.
            </span>
          </h1>
          <p
            className={`${revealClassName} mt-7 max-w-[560px] text-base leading-7 text-[#56675f] delay-150 sm:text-lg sm:leading-8 dark:text-[#a5b6ac]`}
          >
            Find people, start direct or group conversations, and stay in sync
            as messages arrive. FRChat keeps the whole exchange in one calm,
            focused place.
          </p>

          <div
            className={`${revealClassName} mt-8 flex flex-col gap-3 delay-200 sm:flex-row`}
          >
            <Link
              href="/sign-in"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a8f55] px-6 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(10,143,85,0.22)] transition hover:-translate-y-0.5 hover:bg-[#087a49] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0a8f55]"
            >
              Start a conversation
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

          <div
            className={`${revealClassName} mt-8 flex flex-wrap gap-x-5 gap-y-2 delay-200`}
          >
            {reassurance.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66766e] dark:text-[#9daea4]"
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-[#dbf3e4] text-[#087348] dark:bg-[#163a28] dark:text-[#70d99a]">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className={`${revealClassName} relative delay-150 lg:-mr-16`}>
          <div className="absolute top-[8%] left-[8%] -z-10 h-[82%] w-[82%] rounded-full bg-[#bde9cd]/50 blur-3xl dark:bg-[#17663c]/30" />
          <ChatPreview />
        </div>
      </div>
    </section>
  )
}

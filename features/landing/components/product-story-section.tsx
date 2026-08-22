import Link from "next/link"
import {
  ArrowRight,
  Check,
  CheckCheck,
  Search,
  Send,
  UsersRound,
  Zap,
} from "lucide-react"

const benefits = [
  "Search people by name or phone",
  "Start one-to-one and group chats",
  "Keep sender and timestamp context clear",
  "Stay with new messages without losing your place",
] as const

const flow = [
  {
    number: "01",
    title: "Find your people",
    text: "Search with the details you already know.",
  },
  {
    number: "02",
    title: "Shape the room",
    text: "Start direct, or invite a group around the work.",
  },
  {
    number: "03",
    title: "Keep moving",
    text: "Send, receive, and return to the full conversation.",
  },
] as const

function ProductScene() {
  return (
    <div
      role="img"
      aria-label="Illustration of a product team conversation in FRChat"
      className="relative min-h-[500px] overflow-hidden rounded-[34px] bg-[#123829] p-5 text-white shadow-[0_28px_70px_rgba(18,56,41,0.2)] sm:p-8"
    >
      <div className="landing-scene-grid absolute inset-0 opacity-30" />
      <div className="absolute -top-24 -right-20 size-72 rounded-full bg-[#77d798]/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-16 size-64 rounded-full bg-[#c9f35b]/15 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.12em] text-[#d8f7e3] uppercase backdrop-blur">
          Product room
        </span>
        <span className="inline-flex items-center gap-2 text-[10px] font-bold text-white/70">
          <span className="size-2 animate-pulse rounded-full bg-[#78e7a3] motion-reduce:animate-none" />
          4 online
        </span>
      </div>

      <div className="relative mx-auto mt-16 max-w-[400px] rounded-[26px] border border-white/12 bg-[#f8faf5] p-4 text-[#17382a] shadow-[0_25px_60px_rgba(0,0,0,0.25)] sm:p-5 dark:bg-[#101e17] dark:text-[#e9f4ed]">
        <div className="flex items-center gap-3 border-b border-[#173a2a]/8 pb-4 dark:border-white/8">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#0a8f55] text-xs font-extrabold text-white">
            PL
          </span>
          <span className="flex-1">
            <span className="block text-xs font-extrabold">Product launch</span>
            <span className="text-[10px] text-[#718078] dark:text-[#9baca2]">
              7 members
            </span>
          </span>
          <UsersRound className="size-4 text-[#0a8f55]" />
        </div>

        <div className="space-y-3 py-5">
          <div className="flex items-end gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#ffe9d3] text-[8px] font-extrabold text-[#995b1b]">
              AM
            </span>
            <div className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[10px] leading-5 shadow-sm dark:bg-[#1a2d23]">
              Launch checklist is ready. Any blockers?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-[#dff3e7] px-3 py-2 text-[10px] leading-5 dark:bg-[#18482f]">
              All clear here. I will take the final review.
              <span className="mt-1 flex items-center justify-end gap-1 text-[8px] font-bold text-[#0a8f55]">
                10:42 <CheckCheck className="size-3" />
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#173a2a]/8 bg-white px-3 py-2.5 text-[#86928b] dark:border-white/8 dark:bg-[#17271f] dark:text-[#8fa198]">
          <span className="flex-1 text-[9px]">Write a reply...</span>
          <span className="flex size-7 items-center justify-center rounded-full bg-[#0a8f55] text-white">
            <Send className="size-3" />
          </span>
        </div>
      </div>

      <div className="absolute top-28 left-3 rounded-2xl border border-white/12 bg-white/10 p-3 shadow-xl backdrop-blur-md sm:left-7">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#c9f35b] text-[9px] font-extrabold text-[#17382a]">
            SK
          </span>
          <span>
            <span className="block text-[9px] font-extrabold">
              Sofia joined
            </span>
            <span className="text-[8px] text-white/55">just now</span>
          </span>
        </div>
      </div>

      <div className="absolute right-3 bottom-8 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-[#17382a] shadow-2xl sm:right-7 dark:bg-[#16271e] dark:text-[#e9f4ed]">
        <span className="flex size-8 items-center justify-center rounded-xl bg-[#dff3e7] text-[#0a8f55]">
          <Search className="size-4" />
        </span>
        <span>
          <span className="block text-[9px] font-extrabold">
            Find anyone fast
          </span>
          <span className="text-[8px] text-[#718078] dark:text-[#9baca2]">
            Name or phone
          </span>
        </span>
      </div>
    </div>
  )
}

export default function ProductStorySection() {
  return (
    <section
      id="product"
      className="scroll-mt-20 bg-[#f3f6ef] py-20 sm:py-28 dark:bg-[#0d1a13]"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
          <ProductScene />

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#dff3e7] px-3 py-1.5 text-xs font-extrabold text-[#087348] dark:bg-[#173b28] dark:text-[#72dc9b]">
              <Zap className="size-3.5" fill="currentColor" />
              Built for momentum
            </div>
            <h2 className="mt-5 text-[clamp(2.35rem,4.5vw,4.25rem)] leading-[1.02] font-extrabold tracking-[-0.06em] text-balance text-[#14251d] dark:text-[#eef8f1]">
              Better teamwork starts with a clearer room.
            </h2>
            <p className="mt-6 max-w-[540px] text-base leading-7 text-[#617169] dark:text-[#9cada3]">
              FRChat makes the path from finding someone to finishing the
              conversation feel direct. No noisy dashboards, no context lost
              between screens.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-2.5 text-sm leading-6 font-semibold text-[#34483e] dark:text-[#bfd0c6]"
                >
                  <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#d5efdf] text-[#087348] dark:bg-[#173b28] dark:text-[#70d99a]">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  {benefit}
                </div>
              ))}
            </div>

            <Link
              href="/sign-in"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#0a8f55] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a8f55]"
            >
              Open FRChat
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-20 border-t border-[#173a2a]/10 pt-8 dark:border-white/9">
          <p className="text-center text-xs font-extrabold tracking-[0.16em] text-[#708078] uppercase dark:text-[#84968c]">
            From hello to caught up
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {flow.map((step) => (
              <li
                key={step.number}
                className="flex gap-4 rounded-2xl bg-white/70 p-5 dark:bg-white/5"
              >
                <span className="font-mono text-xs font-bold text-[#0a8f55]">
                  {step.number}
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-[#20342a] dark:text-[#e4efe8]">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#718078] dark:text-[#94a59b]">
                    {step.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

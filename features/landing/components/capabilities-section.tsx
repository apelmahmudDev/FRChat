import {
  History,
  MessageCircleMore,
  ShieldCheck,
  UsersRound,
} from "lucide-react"

const capabilities = [
  {
    icon: MessageCircleMore,
    title: "Real-time messaging",
    description:
      "New messages land naturally without pulling you out of the conversation.",
    detail: "Live delivery",
  },
  {
    icon: UsersRound,
    title: "Direct and group chats",
    description:
      "Find a person by name or phone, or bring the right people into one room.",
    detail: "Flexible groups",
  },
  {
    icon: History,
    title: "History that stays useful",
    description:
      "Open a thread and pick up with clear senders, timestamps, and older messages.",
    detail: "Full context",
  },
  {
    icon: ShieldCheck,
    title: "Protected by design",
    description:
      "Your sign-in session stays protected while conversations move through trusted server routes.",
    detail: "Secure access",
    id: "security",
  },
] as const

export default function CapabilitiesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-24 bg-white py-20 sm:py-24 dark:bg-[#0b1510]"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] text-[#0a8f55] uppercase">
              Everything in reach
            </p>
            <h2 className="mt-3 max-w-[650px] text-3xl leading-tight font-extrabold tracking-[-0.045em] text-[#14251d] sm:text-4xl dark:text-[#eef8f1]">
              Less app to manage. More conversation to enjoy.
            </h2>
          </div>
          <p className="max-w-[390px] text-sm leading-6 text-[#66766e] sm:text-right dark:text-[#9cada3]">
            The essentials are close at hand, while the interface stays quiet
            enough for the people in it to matter.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon

            return (
              <article
                id={"id" in capability ? capability.id : undefined}
                key={capability.title}
                className="group scroll-mt-28 rounded-[24px] border border-[#173a2a]/9 bg-[#fafbf7] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-[#0a8f55]/22 hover:bg-white hover:shadow-[0_18px_50px_rgba(23,58,42,0.09)] dark:border-white/8 dark:bg-[#101e17] dark:hover:border-[#60d78d]/25 dark:hover:bg-[#13241b] dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#dff3e7] text-[#087348] transition group-hover:scale-105 group-hover:rotate-[-4deg] dark:bg-[#183d2a] dark:text-[#6cdb96]">
                    <Icon className="size-5" strokeWidth={1.9} />
                  </span>
                  <span className="text-xs font-extrabold text-[#b4beb8] dark:text-[#516158]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-base font-extrabold tracking-[-0.02em] text-[#1a3025] dark:text-[#e7f1eb]">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#66766e] dark:text-[#9cada3]">
                  {capability.description}
                </p>
                <p className="mt-5 border-t border-[#173a2a]/8 pt-4 text-[11px] font-extrabold tracking-[0.1em] text-[#0a8f55] uppercase dark:border-white/8 dark:text-[#60d78d]">
                  {capability.detail}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

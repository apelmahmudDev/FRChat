import {
  CheckCheck,
  FileText,
  Info,
  MessageCircleMore,
  Paperclip,
  Search,
  Send,
  SlidersHorizontal,
  Smile,
  Users,
} from "lucide-react"

const conversations = [
  {
    initials: "PT",
    name: "Product team",
    message: "Maya: The new flow is ready",
    time: "10:34",
    active: true,
    tone: "bg-[#dff3e7] text-[#087348] dark:bg-[#1a432f] dark:text-[#7ce2a3]",
  },
  {
    initials: "SB",
    name: "Sofia Bennett",
    message: "Can you share the notes?",
    time: "9:48",
    active: false,
    tone: "bg-[#fff0d8] text-[#925710] dark:bg-[#49351e] dark:text-[#f0bf76]",
  },
  {
    initials: "DT",
    name: "Design team",
    message: "3 new messages",
    time: "9:15",
    active: false,
    tone: "bg-[#e8eefb] text-[#42629c] dark:bg-[#26354e] dark:text-[#a9c4f3]",
  },
] as const

function ConversationRail() {
  return (
    <aside className="hidden border-r border-[#173a2a]/8 bg-[#fbfcf8] sm:block dark:border-white/8 dark:bg-[#0f1c16]">
      <div className="border-b border-[#173a2a]/8 px-3 py-3 dark:border-white/8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-[-0.03em] text-[#101b16] dark:text-[#edf6f0]">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#0a8f55] text-white shadow-sm">
              <MessageCircleMore className="size-4" />
            </span>
            FRChat
          </div>
          <span className="flex size-7 items-center justify-center rounded-full bg-[#f0f2ef] text-[#34483e] dark:bg-white/7 dark:text-[#c8d7cf]">
            <SlidersHorizontal className="size-3.5" />
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 rounded-full bg-[#eef0ed] px-3 py-2 text-[#718078] dark:bg-white/6 dark:text-[#91a198]">
          <Search className="size-3" />
          <span className="text-[8px] font-medium">Search conversations</span>
        </div>
      </div>
      <div className="flex gap-1 px-3 pt-3 text-[8px] font-bold text-[#697870] dark:text-[#91a198]">
        <span className="rounded-full bg-[#dff3e7] px-2.5 py-1 text-[#087348] dark:bg-[#193c29] dark:text-[#71da9a]">
          All
        </span>
        <span className="px-2 py-1">Direct</span>
        <span className="px-2 py-1">Groups</span>
      </div>
      <div className="space-y-1 p-2.5">
        {conversations.map((conversation) => (
          <div
            key={conversation.name}
            className={`flex gap-2.5 rounded-xl p-2.5 ${
              conversation.active
                ? "bg-white shadow-[0_5px_18px_rgba(23,58,42,0.08)] ring-1 ring-[#173a2a]/6 dark:bg-[#182820] dark:shadow-[0_5px_18px_rgba(0,0,0,0.18)] dark:ring-white/7"
                : ""
            }`}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold ${conversation.tone}`}
            >
              {conversation.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-1">
                <span className="truncate text-[9px] font-extrabold text-[#183126] dark:text-[#e1eee6]">
                  {conversation.name}
                </span>
                <span className="text-[7px] text-[#829087] dark:text-[#7e9086]">
                  {conversation.time}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-[8px] text-[#718078] dark:text-[#91a198]">
                {conversation.message}
              </span>
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}

function MessageThread() {
  return (
    <section className="flex min-w-0 flex-col bg-white dark:bg-[#101d17]">
      <header className="flex h-14 items-center justify-between border-b border-[#173a2a]/8 px-3.5 sm:px-4 dark:border-white/8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#15382a] text-[9px] font-extrabold text-white">
            PT
          </span>
          <span>
            <span className="flex items-center gap-1 text-[10px] font-extrabold text-[#173126] dark:text-[#e4f0e8]">
              Product team
              <span className="size-1.5 rounded-full bg-[#5bd88e]" />
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[8px] text-[#718078] dark:text-[#91a198]">
              <Users className="size-2.5" /> 8 members
            </span>
          </span>
        </div>
        <span className="flex size-7 items-center justify-center rounded-full bg-[#eef6f0] text-[#0a8f55] dark:bg-[#183b29] dark:text-[#71da9a]">
          <Info className="size-3.5" />
        </span>
      </header>

      <div className="landing-chat-surface flex min-h-[276px] flex-1 flex-col justify-end gap-3 px-3 py-4 sm:px-5">
        <span className="self-center rounded-full bg-[#f0f3ed] px-2.5 py-1 text-[7px] font-bold text-[#718078] dark:bg-white/7 dark:text-[#91a198]">
          Today
        </span>
        <div className="flex items-end gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#fff0d8] text-[8px] font-extrabold text-[#925710]">
            JP
          </span>
          <div>
            <span className="mb-1 block text-[8px] font-bold text-[#395047] dark:text-[#c9d8d0]">
              James{" "}
              <span className="font-medium text-[#92a098] dark:text-[#7f9187]">
                10:20 AM
              </span>
            </span>
            <div className="max-w-[245px] rounded-2xl rounded-bl-md border border-[#173a2a]/8 bg-white px-3 py-2.5 text-[9px] leading-relaxed text-[#263b31] shadow-[0_5px_15px_rgba(23,58,42,0.05)] dark:border-white/8 dark:bg-[#182820] dark:text-[#dce9e1] dark:shadow-[0_5px_15px_rgba(0,0,0,0.16)]">
              Morning team! The latest product flow is ready for review.
            </div>
          </div>
        </div>
        <div className="ml-9 flex max-w-[220px] items-center gap-2 rounded-xl border border-[#173a2a]/8 bg-white p-2.5 shadow-[0_5px_18px_rgba(23,58,42,0.06)] dark:border-white/8 dark:bg-[#182820] dark:shadow-[0_5px_18px_rgba(0,0,0,0.16)]">
          <span className="flex size-7 items-center justify-center rounded-lg bg-[#ffe7e4] text-[#db4c3f]">
            <FileText className="size-3.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[8px] font-extrabold text-[#263b31] dark:text-[#dce9e1]">
              Product-flow.pdf
            </span>
            <span className="text-[7px] text-[#8a978f] dark:text-[#83958b]">
              2.4 MB
            </span>
          </span>
        </div>
        <div className="flex animate-in justify-end delay-500 duration-700 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none">
          <div className="max-w-[245px] rounded-2xl rounded-br-md bg-[#ddf4e6] px-3 py-2.5 text-[9px] leading-relaxed text-[#17382a] dark:bg-[#18482f] dark:text-[#e4f2e9]">
            Looks great. I added the launch notes and tagged everyone.
            <span className="mt-1 flex items-center justify-end gap-1 text-[7px] font-bold text-[#0a8f55]">
              10:23 AM <CheckCheck className="size-2.5" />
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#173a2a]/8 bg-white p-3 dark:border-white/8 dark:bg-[#101d17]">
        <div className="flex items-center gap-2 rounded-xl border border-[#173a2a]/10 bg-[#fbfcf8] px-2.5 py-2 text-[#718078] dark:border-white/9 dark:bg-[#17271f] dark:text-[#91a198]">
          <Paperclip className="size-3.5" />
          <span className="flex-1 text-[8px]">Message Product team</span>
          <Smile className="size-3.5" />
          <span className="flex size-6 items-center justify-center rounded-full bg-[#0a8f55] text-white">
            <Send className="size-3" />
          </span>
        </div>
      </div>
    </section>
  )
}

export default function ChatPreview() {
  return (
    <div
      className="relative mx-auto w-full max-w-[980px]"
      role="img"
      aria-label="Preview of the FRChat messaging experience"
    >
      <div className="absolute -top-5 right-5 z-20 hidden items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-[10px] font-bold text-[#17382a] shadow-[0_12px_32px_rgba(23,58,42,0.14)] backdrop-blur sm:flex dark:border-white/10 dark:bg-[#16271e]/90 dark:text-[#dce9e1] dark:shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
        <span className="size-2 animate-pulse rounded-full bg-[#24ba6b] shadow-[0_0_0_4px_rgba(36,186,107,0.12)] motion-reduce:animate-none" />
        Live now
      </div>
      <div className="absolute -right-5 -bottom-5 -z-10 h-32 w-32 rounded-full bg-[#c9f35b]/35 blur-3xl" />
      <div className="overflow-hidden rounded-[26px] border border-[#173a2a]/10 bg-white shadow-[0_30px_80px_rgba(29,68,49,0.17),0_3px_12px_rgba(29,68,49,0.08)] dark:border-white/9 dark:bg-[#101d17] dark:shadow-[0_30px_80px_rgba(0,0,0,0.32),0_3px_12px_rgba(0,0,0,0.2)]">
        <div className="flex h-9 items-center justify-between border-b border-[#173a2a]/8 bg-[#fbfcf8] px-3.5 dark:border-white/8 dark:bg-[#0f1c16]">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-[#ff8375]" />
            <span className="size-2 rounded-full bg-[#f7c34b]" />
            <span className="size-2 rounded-full bg-[#58c985]" />
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-[7px] font-bold tracking-[0.08em] text-[#819087] shadow-sm dark:bg-white/7 dark:text-[#91a198]">
            fr-chat.vercel.app
          </span>
          <span className="w-8" />
        </div>
        <div className="grid min-h-[388px] grid-cols-1 sm:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
          <ConversationRail />
          <MessageThread />
        </div>
      </div>
    </div>
  )
}

import { CheckCheck, Download, FileText, Play, ThumbsUp } from "lucide-react"

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${color}`}
    >
      {initials}
    </span>
  )
}

function Reaction({ count }: { count: number }) {
  return (
    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-[11px] shadow-xs">
      <ThumbsUp className="size-3 fill-amber-400 text-amber-400" />
      {count}
    </span>
  )
}

export default function MessageList() {
  const waveform = [
    8, 14, 20, 10, 17, 24, 12, 19, 9, 22, 15, 7, 18, 11, 21, 13, 8, 16, 10, 6,
  ]

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-5 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex justify-center">
          <span className="rounded-full bg-muted px-5 py-1.5 text-xs text-muted-foreground">
            Today
          </span>
        </div>
        <div className="flex items-start gap-3">
          <Avatar initials="JP" color="bg-sky-100 text-sky-700" />
          <div className="max-w-[82%]">
            <div className="mb-1.5 flex items-center gap-3 text-xs">
              <span className="font-semibold">James Park</span>
              <span className="text-muted-foreground">10:20 AM</span>
            </div>
            <div className="rounded-2xl rounded-tl-md border bg-card p-4 text-sm leading-6 shadow-xs">
              <p>Morning team! Here&apos;s the latest update on the roadmap.</p>
              <p>We&apos;re on track for the Q2 release. 🚀</p>
              <button
                type="button"
                className="mt-3 flex w-full items-center gap-3 rounded-xl border bg-background p-3 text-left transition hover:bg-muted/50"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <FileText className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">
                    Q2 Roadmap Update.pdf
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    2.4 MB
                  </span>
                </span>
                <Download className="size-4" />
              </button>
            </div>
            <Reaction count={3} />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[72%] rounded-2xl rounded-br-md bg-primary/10 px-4 py-3 text-sm leading-6">
            <p>
              Looks great! Can we add a section on user feedback highlights?
            </p>
            <div className="mt-1.5 flex items-center justify-end gap-1 text-[11px] text-primary">
              <span>10:22 AM</span>
              <CheckCheck className="size-3.5" />
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Avatar initials="SB" color="bg-rose-100 text-rose-700" />
          <div className="max-w-[82%]">
            <div className="mb-1.5 flex items-center gap-3 text-xs">
              <span className="font-semibold">Sophia Bennett</span>
              <span className="text-muted-foreground">10:23 AM</span>
            </div>
            <div className="rounded-2xl rounded-tl-md border bg-card px-4 py-3 text-sm shadow-xs">
              Absolutely, I&apos;ll compile the top feedback and add it in.
            </div>
            <Reaction count={2} />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Avatar initials="LC" color="bg-amber-100 text-amber-800" />
          <div className="max-w-[82%]">
            <div className="mb-1.5 flex items-center gap-3 text-xs">
              <span className="font-semibold">Liam Chen</span>
              <span className="text-muted-foreground">10:24 AM</span>
            </div>
            <div className="flex min-w-[260px] items-center gap-3 rounded-2xl rounded-tl-md border bg-card p-3 shadow-xs sm:min-w-[360px]">
              <button
                type="button"
                aria-label="Play voice message"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <Play className="ml-0.5 size-4 fill-current" />
              </button>
              <div
                className="flex h-6 flex-1 items-center gap-0.5 overflow-hidden"
                aria-hidden="true"
              >
                {waveform.map((height, index) => (
                  <span
                    key={index}
                    className="w-0.5 shrink-0 rounded-full bg-muted-foreground/45"
                    style={{ height }}
                  />
                ))}
              </div>
              <span className="text-xs">0:28</span>
              <span className="rounded-full border px-2 py-1 text-[10px]">
                1x
              </span>
            </div>
            <Reaction count={1} />
          </div>
        </div>
      </div>
    </main>
  )
}

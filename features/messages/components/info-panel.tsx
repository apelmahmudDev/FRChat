import {
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Link2,
  ListChecks,
  Pin,
  Sprout,
  Users,
  VolumeX,
  X,
} from "lucide-react"

import type { Conversation } from "@/features/messages/data/conversations"
import { IconTooltip } from "@/components/ui/icon-tooltip"

const actions = [
  { label: "Members", icon: Users },
  { label: "Files", icon: FileText },
  { label: "Links", icon: Link2 },
  { label: "Pinned", icon: Pin },
  { label: "Mute", icon: VolumeX },
]

const members = ["SB", "MO", "LC", "JP", "EB"]

type InfoPanelProps = {
  conversation: Conversation
  onClose: () => void
}

export default function InfoPanel({ conversation, onClose }: InfoPanelProps) {
  return (
    <aside className="absolute inset-y-0 right-0 z-30 flex w-[min(310px,90vw)] shrink-0 flex-col border-l bg-card shadow-xl 2xl:static 2xl:w-[310px] 2xl:shadow-none">
      <div className="flex h-[82px] items-center justify-between border-b px-6">
        <h2 className="text-sm font-semibold">About this conversation</h2>
        <IconTooltip label="Close details" side="left">
          <button
            type="button"
            aria-label="Close information panel"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full transition hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </IconTooltip>
      </div>

      <div className="border-b px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
            {conversation.initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold">{conversation.name}</h3>
              {conversation.group && <Sprout className="size-4 text-primary" />}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {conversation.members
                ? `${conversation.members} members`
                : "Active now"}
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Collaborate on product strategy, roadmap, and launches.
        </p>
        <div className="mt-5 grid grid-cols-5 gap-1">
          {actions.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className="group flex flex-col items-center gap-2 text-[10px] text-muted-foreground"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="size-4" />
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="border-b px-6 py-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Members ({conversation.members ?? 2})
          </h3>
          <button type="button" className="text-xs font-medium text-primary">
            See all
          </button>
        </div>
        <div className="mt-4 flex items-center -space-x-2">
          {members.map((member, index) => (
            <span
              key={member}
              className={`flex size-9 items-center justify-center rounded-full border-2 border-card text-[9px] font-bold ${index % 2 ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"}`}
            >
              {member}
            </span>
          ))}
          <span className="flex size-9 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-semibold">
            +7
          </span>
        </div>
      </section>

      <section className="border-b px-6 py-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Shared files</h3>
          <button type="button" className="text-xs font-medium text-primary">
            See all
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <FileRow
            icon={<FileText className="size-4" />}
            color="bg-red-50 text-red-600"
            title="Q2 Roadmap Update.pdf"
            meta="2.4 MB · James Park"
          />
          <FileRow
            icon={<FileSpreadsheet className="size-4" />}
            color="bg-emerald-50 text-emerald-600"
            title="User Feedback Summary.xlsx"
            meta="1.1 MB · Sophia Bennett"
          />
          <FileRow
            icon={<ListChecks className="size-4" />}
            color="bg-amber-50 text-amber-600"
            title="Design System Guide.sketch"
            meta="5.6 MB · Liam Chen"
          />
        </div>
      </section>

      <section className="px-6 py-5">
        <h3 className="text-sm font-semibold">Quick actions</h3>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            className="flex h-10 w-full items-center gap-3 rounded-lg bg-muted/70 px-4 text-xs font-medium transition hover:bg-muted"
          >
            <CheckCircle2 className="size-4" />
            Create task
          </button>
          <button
            type="button"
            className="flex h-10 w-full items-center gap-3 rounded-lg bg-muted/70 px-4 text-xs font-medium transition hover:bg-muted"
          >
            <CalendarDays className="size-4" />
            Schedule meeting
          </button>
        </div>
      </section>
    </aside>
  )
}

function FileRow({
  icon,
  color,
  title,
  meta,
}: {
  icon: React.ReactNode
  color: string
  title: string
  meta: string
}) {
  return (
    <button type="button" className="flex w-full items-center gap-3 text-left">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${color}`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">{title}</span>
        <span className="mt-0.5 block text-[10px] text-muted-foreground">
          {meta}
        </span>
      </span>
    </button>
  )
}

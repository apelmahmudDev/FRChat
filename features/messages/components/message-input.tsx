import { AtSign, Mic, Paperclip, Plus, Send, Smile } from "lucide-react"

import { IconTooltip } from "@/components/ui/icon-tooltip"

const iconButtonClass =
  "flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"

type MessageInputProps = {
  conversationName: string
}

export default function MessageInput({ conversationName }: MessageInputProps) {
  return (
    <footer className="shrink-0 bg-background px-4 pb-4 sm:px-7 sm:pb-6">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-3 shadow-xs focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
        <label htmlFor="message" className="sr-only">
          Message {conversationName}
        </label>
        <textarea
          id="message"
          rows={2}
          placeholder={`Message ${conversationName}`}
          className="max-h-32 min-h-12 w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-0.5">
          <IconTooltip label="Add attachment" side="top">
            <button
              type="button"
              aria-label="Add attachment"
              className={iconButtonClass}
            >
              <Plus className="size-5" />
            </button>
          </IconTooltip>
          <IconTooltip label="Format message" side="top">
            <button
              type="button"
              aria-label="Format message"
              className={`${iconButtonClass} text-sm font-medium`}
            >
              Aa
            </button>
          </IconTooltip>
          <IconTooltip label="Choose emoji" side="top">
            <button
              type="button"
              aria-label="Add emoji"
              className={iconButtonClass}
            >
              <Smile className="size-[18px]" />
            </button>
          </IconTooltip>
          <IconTooltip label="Mention someone" side="top">
            <button
              type="button"
              aria-label="Mention someone"
              className={iconButtonClass}
            >
              <AtSign className="size-[18px]" />
            </button>
          </IconTooltip>
          <IconTooltip label="Attach file" side="top">
            <button
              type="button"
              aria-label="Attach file"
              className={iconButtonClass}
            >
              <Paperclip className="size-[18px]" />
            </button>
          </IconTooltip>
          <div className="ml-auto flex items-center gap-2">
            <IconTooltip label="Record voice message" side="top">
              <button
                type="button"
                aria-label="Record voice message"
                className={iconButtonClass}
              >
                <Mic className="size-[18px]" />
              </button>
            </IconTooltip>
            <IconTooltip label="Send message" side="top">
              <button
                type="button"
                aria-label="Send message"
                className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                <Send className="size-[18px]" />
              </button>
            </IconTooltip>
          </div>
        </div>
      </div>
    </footer>
  )
}

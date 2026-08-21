import { MessageCircle, ShieldCheck } from "lucide-react"

export default function BrandPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-background p-12 text-white lg:flex lg:flex-col lg:justify-between">
      {/* Background circles */}

      <div className="absolute -top-20 -left-20 size-80 rounded-full border border-emerald-400/20" />

      <div className="absolute right-0 bottom-0 size-96 rounded-full border border-emerald-400/10" />

      {/* Logo */}

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500">
            <MessageCircle className="size-7 text-white" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            FR<span className="text-emerald-400">Chat</span>
          </h1>
        </div>

        <div className="mt-12 max-w-md">
          <h2 className="text-3xl leading-tight font-semibold">
            Simple.
            <br />
            Private.
            <br />
            Real-time.
          </h2>

          <p className="mt-5 text-lg text-white/70">
            Connect with anyone, anytime, anywhere.
          </p>
        </div>
      </div>

      {/* Illustration */}

      <div className="relative mt-10 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-emerald-500/20 backdrop-blur">
            <MessageCircle className="size-12 text-emerald-300" />
          </div>

          <div className="flex size-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
            <ShieldCheck className="size-12 text-emerald-300" />
          </div>
        </div>
      </div>

      <p className="text-sm text-white/50">
        Secure conversations powered by FRChat
      </p>
    </section>
  )
}

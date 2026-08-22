import Link from "next/link"
import { ArrowRight, LockKeyhole, Radio, Sparkles } from "lucide-react"

import BrandLogo from "./brand-logo"

const footerLinkClassName =
  "rounded-sm transition-colors hover:text-[#0a8f55] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a8f55]"

export default function ClosingSection() {
  return (
    <>
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 dark:bg-[#0a120e]">
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-7 overflow-hidden rounded-[30px] bg-[#dff3e7] px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:px-12 lg:py-10 dark:bg-[#153b2b]">
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-10 size-56 rounded-full border-[34px] border-white/35"
          />
          <div
            aria-hidden="true"
            className="absolute right-1/3 bottom-0 h-20 w-20 rounded-full bg-[#c9f35b]/55 blur-2xl"
          />
          <div className="relative flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#0a8f55] text-white shadow-[0_10px_24px_rgba(10,143,85,0.2)]">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h2 className="text-2xl font-extrabold tracking-[-0.035em] text-[#153126] sm:text-3xl dark:text-[#eef8f1]">
                Ready for a calmer conversation?
              </h2>
              <p className="mt-2 max-w-[630px] text-sm leading-6 text-[#50675b] dark:text-[#b5c8bd]">
                Sign in with your name and phone number, then find the person or
                group you want to reach.
              </p>
            </div>
          </div>
          <Link
            href="/sign-in"
            className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a8f55] px-6 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(10,143,85,0.2)] transition hover:-translate-y-0.5 hover:bg-[#087a49] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0a8f55]"
          >
            Start chatting
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer
        id="about"
        className="scroll-mt-20 border-t border-[#173a2a]/8 bg-[#f8f9f5] dark:border-white/8 dark:bg-[#09110d]"
      >
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <BrandLogo />
            <p className="mt-4 max-w-[330px] text-sm leading-6 text-[#68776f] dark:text-[#95a79d]">
              Simple, secure, real-time conversations for the people and work
              that matter.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#173a2a]/9 bg-white px-3 py-1.5 text-[11px] font-bold text-[#50635a] dark:border-white/8 dark:bg-white/5 dark:text-[#aec0b6]">
                <Radio className="size-3 text-[#0a8f55]" /> Real-time
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#173a2a]/9 bg-white px-3 py-1.5 text-[11px] font-bold text-[#50635a] dark:border-white/8 dark:bg-white/5 dark:text-[#aec0b6]">
                <LockKeyhole className="size-3 text-[#0a8f55]" /> Secure session
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-[#20342a] uppercase dark:text-[#e3eee7]">
              Explore
            </p>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold text-[#68776f] dark:text-[#95a79d]">
              <a href="#features" className={footerLinkClassName}>
                Features
              </a>
              <a href="#product" className={footerLinkClassName}>
                How it works
              </a>
              <a href="#security" className={footerLinkClassName}>
                Security
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-[#20342a] uppercase dark:text-[#e3eee7]">
              Get started
            </p>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold text-[#68776f] dark:text-[#95a79d]">
              <Link href="/sign-in" className={footerLinkClassName}>
                Sign in or join
              </Link>
              <Link href="/messages" className={footerLinkClassName}>
                Open messages
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 border-t border-[#173a2a]/8 px-5 py-6 text-xs text-[#7b8982] sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-white/8 dark:text-[#71847a]">
          <p>&copy; 2026 FRChat. Built for better conversations.</p>
          <p>Responsive. Accessible. Focused.</p>
        </div>
      </footer>
    </>
  )
}

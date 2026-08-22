import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import BrandLogo from "@/components/brand-logo"

import ThemeSwitcher from "./theme-switcher"

const navigation = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#product" },
  { label: "Security", href: "#security" },
  { label: "About", href: "#about" },
] as const

type SiteHeaderProps = {
  hasSession: boolean
}

export default function SiteHeader({ hasSession }: SiteHeaderProps) {
  const chatHref = hasSession ? "/messages" : "/sign-in"

  return (
    <header className="sticky top-0 z-50 border-b border-[#183c2b]/8 bg-[#f7f8f2]/88 backdrop-blur-xl dark:border-white/8 dark:bg-[#0b1510]/88">
      <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          aria-label="FRChat home"
          className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a8f55]"
        >
          <BrandLogo />
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#42534b] transition-colors hover:text-[#0a8f55] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a8f55] dark:text-[#aebdb4] dark:hover:text-[#74d79a]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {!hasSession && (
            <Link
              href="/sign-in"
              className="hidden rounded-lg px-2 py-2 text-sm font-semibold text-[#20342a] transition-colors hover:text-[#0a8f55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a8f55] sm:inline-flex dark:text-[#e4eee8] dark:hover:text-[#74d79a]"
            >
              Log in
            </Link>
          )}
          <ThemeSwitcher />
          <Link
            href={chatHref}
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-[#0a8f55] px-4 text-sm font-bold text-white shadow-[0_8px_22px_rgba(10,143,85,0.2)] transition hover:-translate-y-0.5 hover:bg-[#087a49] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#0a8f55] sm:px-5"
          >
            {hasSession ? "Open messages" : "Start chatting"}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}

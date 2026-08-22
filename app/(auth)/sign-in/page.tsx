import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { APP_CONFIG } from "@/constants/app-config"
import SignInForm from "@/features/auth/components/sign-in-form"
import BrandPanel from "@/features/auth/components/brand-panel"
import { hasAuthSessionCookie } from "@/features/auth/lib/auth-cookie"

const signInTitle = `${APP_CONFIG.name} | Sign in`

export const metadata: Metadata = {
  title: signInTitle,
  description: "Sign in to your account to continue.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sign-in" },
  openGraph: {
    title: signInTitle,
    description: "Sign in to your account to continue.",
    url: "/sign-in",
    type: "website",
  },
}

type SignInPageProps = {
  searchParams: Promise<{ next?: string | string[] }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const requestedDestination = (await searchParams).next
  const redirectTo =
    typeof requestedDestination === "string" &&
    requestedDestination.startsWith("/messages") &&
    !requestedDestination.startsWith("//")
      ? requestedDestination
      : "/messages"

  if (await hasAuthSessionCookie()) {
    redirect(redirectTo)
  }

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[#f7f8f2] dark:bg-[#08110d]">
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-[#c9f35b]/12 blur-3xl dark:bg-[#80be4d]/6"
      />
      <div
        aria-hidden="true"
        className="landing-dot-grid absolute top-20 -left-24 size-72 text-[#0a8f55]/16 dark:text-[#74d79a]/12"
      />
      <div
        aria-hidden="true"
        className="absolute right-[5%] bottom-[8%] size-72 rounded-full bg-[#8ad8a7]/12 blur-3xl dark:bg-[#17663c]/12"
      />

      <div className="relative mx-auto flex min-h-svh max-w-[1180px] items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="grid w-full max-w-[1060px] overflow-hidden rounded-[26px] border border-[#173a2a]/10 bg-white shadow-[0_14px_40px_rgba(20,52,37,0.08)] sm:rounded-[30px] lg:grid-cols-[0.9fr_1.1fr] dark:border-white/9 dark:bg-[#0f1a14] dark:shadow-none">
          <BrandPanel />

          <section className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-14">
            <SignInForm redirectTo={redirectTo} />
          </section>
        </div>
      </div>
    </main>
  )
}

import type { Metadata } from "next"
import { APP_CONFIG } from "@/constants/app-config"
import SignInForm from "@/features/auth/components/sign-in-form"
import BrandPanel from "@/features/auth/components/brand-panel"

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

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6">
        <div className="grid w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl lg:grid-cols-2">
          {/* Left Branding */}
          <BrandPanel />

          {/* Right Login */}
          <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <SignInForm />
          </section>
        </div>
      </div>
    </main>
  )
}

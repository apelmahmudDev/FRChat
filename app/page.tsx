import type { Metadata } from "next"

import { hasAuthSessionCookie } from "@/features/auth/lib/auth-cookie"
import CapabilitiesSection from "@/features/landing/components/capabilities-section"
import ClosingSection from "@/features/landing/components/closing-section"
import HeroSection from "@/features/landing/components/hero-section"
import ProductStorySection from "@/features/landing/components/product-story-section"
import SiteHeader from "@/features/landing/components/site-header"

export const metadata: Metadata = {
  title: "Real-time conversations, made simple",
  description:
    "Find people, start direct or group conversations, and stay connected with secure real-time messaging in FRChat.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "FRChat | Real-time conversations, made simple",
    description:
      "A calm, focused place for direct messages, group conversations, and live updates.",
    url: "/",
    type: "website",
  },
}

export default async function Page() {
  const hasSession = await hasAuthSessionCookie()

  return (
    <div className="landing-page min-h-screen overflow-clip bg-[#f7f8f2] text-[#14251d] selection:bg-[#c9f35b] selection:text-[#14251d] dark:bg-[#08110d] dark:text-[#eef8f1]">
      <SiteHeader hasSession={hasSession} />
      <main>
        <HeroSection hasSession={hasSession} />
        <CapabilitiesSection />
        <ProductStorySection hasSession={hasSession} />
        <ClosingSection hasSession={hasSession} />
      </main>
    </div>
  )
}

import type { Metadata } from "next"

import CapabilitiesSection from "@/features/landing/components/capabilities-section"
import ClosingSection from "@/features/landing/components/closing-section"
import HeroSection from "@/features/landing/components/hero-section"
import styles from "@/features/landing/components/landing.module.css"
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

export default function Page() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <HeroSection />
        <CapabilitiesSection />
        <ProductStorySection />
        <ClosingSection />
      </main>
    </div>
  )
}

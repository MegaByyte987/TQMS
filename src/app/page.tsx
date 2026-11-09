import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFlow } from "@/components/landing/landing-flow";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingShowcase } from "@/components/landing/landing-showcase";
import { LandingFAQ } from "@/components/landing/landing-faq";
import { LandingFooter } from "@/components/landing/landing-footer";

export default async function RootPage() {
  const session = await getSession();

  // If authenticated, send them to the dashboard
  if (session) {
    redirect("/queue");
  }

  // Otherwise, render the beautiful landing page
  return (
    <div className="landing-page">
      {/* Inline SVG symbols from the reference design */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></symbol>
        <symbol id="plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
        <symbol id="list" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></symbol>
        <symbol id="tr" viewBox="0 0 24 24"><path d="M2 17h20M5 17l1-9h9l1 4h3l2 5"/></symbol>
        <symbol id="chart" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></symbol>
        <symbol id="qrs" viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z"/></symbol>
        <symbol id="ok" viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></symbol>
        <symbol id="print" viewBox="0 0 24 24"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/></symbol>
        <symbol id="dl" viewBox="0 0 24 24"><path d="M12 4v12m-5-5 5 5 5-5M5 20h14"/></symbol>
        <symbol id="chev" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></symbol>
        <symbol id="flag" viewBox="0 0 24 24"><path d="M5 21V4m0 0h12l-2 4 2 4H5"/></symbol>
        <symbol id="cal" viewBox="0 0 24 24"><path d="M4 7h16v13H4zM4 11h16M8 3v4M16 3v4"/></symbol>
        <symbol id="info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></symbol>
      </svg>

      <LandingHeader />
      <main id="top">
        <LandingHero />
        <LandingFlow />
        <LandingFeatures />
        <LandingShowcase />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  );
}
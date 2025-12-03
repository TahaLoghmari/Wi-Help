import {
  Navigation,
  HeroSection,
  TrustLogosSection,
  FeaturesSection,
  TrustVerificationSection,
  TestimonialsSection,
  CTASection,
  NewFooterSection,
} from "@/features/landing-page";

export function LandingPage() {
  return (
    <div className="bg-brand-bg relative flex h-screen flex-col overflow-auto">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <TrustLogosSection />
        <FeaturesSection />
        <TrustVerificationSection />
        <TestimonialsSection />
        <CTASection />
        <NewFooterSection />
      </main>
    </div>
  );
}

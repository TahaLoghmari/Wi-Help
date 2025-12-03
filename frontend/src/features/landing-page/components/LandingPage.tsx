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
    <div className="bg-brand-bg relative overflow-x-hidden">
      <Navigation />
      <main className="pt-24">
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

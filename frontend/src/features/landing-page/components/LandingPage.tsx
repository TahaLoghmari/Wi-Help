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
    <div
      className="relative overflow-x-hidden"
      style={{ backgroundColor: "#fbfbfb" }}
    >
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

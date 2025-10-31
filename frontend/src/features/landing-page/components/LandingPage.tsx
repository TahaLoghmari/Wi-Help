import {
  FooterSection,
  Header,
  JoinSection,
  ReviewsSection,
  ServicesSection,
  StatsSection,
  StepsSection,
  WelcomeSection,
} from "@/features/landing-page";

export function LandingPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center overflow-y-auto">
      <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
        <Header />
      </div>
      <div className="flex w-full flex-col items-center bg-linear-to-br from-[#133545] to-[#4b88cf] pt-20 pb-15">
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
          <WelcomeSection />
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-[#fafafb]">
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
          <StatsSection />
          <ServicesSection />
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-linear-to-r from-[#ffecb4] to-[#fffffd]">
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
          <StepsSection />
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-linear-to-r from-[#143949] to-[#21536a]">
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
          <JoinSection />
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-[#fafafb]">
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
          <ReviewsSection />
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-[#143948]">
        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}

import { Header } from "@/features/landing-page";

export function LandingPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center overflow-y-auto">
      <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
        <Header />
      </div>
    </div>
  );
}

import { STEPS } from "@/features/landing-page";

export function StepsSection() {
  return (
    <div className="my-12 flex flex-col gap-10 md:my-20 md:gap-16">
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 md:gap-4">
        <p className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          How Wi Help Works
        </p>
        <p className="text-center text-sm text-gray-600 md:text-base">
          Simple steps to get professional healthcare at home
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {STEPS.map((step, idx) => {
          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center gap-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] p-2 text-white">
                {idx + 1}
              </div>
              <p className="text-center font-bold text-gray-700">
                {step.title}
              </p>
              <p className="text-center text-xs text-gray-600">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

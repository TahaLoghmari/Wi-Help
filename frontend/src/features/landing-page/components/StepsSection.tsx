import { STEPS } from "@/features/landing-page";

export function StepsSection() {
  return (
    <div className="my-20 flex flex-col gap-16">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <p className="text-4xl font-bold">How Wi Help Works</p>
        <p className="text-center text-gray-600">
          Simple steps to get professional healthcare at home
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {STEPS.map((step, idx) => {
          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center gap-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] p-2 text-white">
                {idx + 1}
              </div>
              <p className="font-bold text-gray-700">{step.title}</p>
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

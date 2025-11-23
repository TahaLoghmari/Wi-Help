import { STATS } from "@/features/landing-page";

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 gap-4 p-8 py-16 sm:grid-cols-2 md:gap-8 md:p-16 md:py-28 lg:grid-cols-4">
      {STATS.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex flex-col items-center justify-center gap-1 rounded-md bg-white p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-r from-[#3fa6ff] to-[#14d3ac] p-2">
              <Icon />
            </div>
            <p className="mt-2 text-center font-bold">{stat.title}</p>
            <p className="text-center text-xs text-gray-600">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

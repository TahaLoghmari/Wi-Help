import { STATS } from "@/features/landing-page";

export function StatsSection() {
  return (
    <div className="grid grid-cols-4 gap-8 p-16 py-28">
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
            <p className="mt-2 font-bold">{stat.title}</p>
            <p className="text-xs text-gray-600">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}

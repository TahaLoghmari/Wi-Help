import { useNavigate } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { ROUTE_PATHS } from "@/config/routes";

export function CTASection() {
  const navigate = useNavigate();

  const handleFindCare = () => {
    navigate({ to: ROUTE_PATHS.AUTH.REGISTER });
  };

  const handleApplyProfessional = () => {
    navigate({ to: ROUTE_PATHS.AUTH.REGISTER });
  };

  return (
    <section className="bg-white px-6 py-24">
      <div className="border-brand-teal/20 relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border bg-[#f0fdf9] p-12 text-center md:p-20">
        {/* Grain Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
          }}
        ></div>
        {/* Decorative Circles */}
        <div className="bg-brand-teal/5 absolute top-0 left-0 h-64 w-64 -translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl"></div>
        <div className="bg-brand-blue/5 absolute right-0 bottom-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="bg-brand-teal shadow-brand-teal/20 mx-auto mb-8 flex h-14 w-14 rotate-3 items-center justify-center rounded-2xl shadow-lg">
            <HeartHandshake className="text-brand-dark h-7 w-7" />
          </div>
          <h2 className="text-brand-dark mb-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Ready to simplify care?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg font-light text-slate-500">
            Join the Wi-Help community today. Whether you need care or provide
            it, we have a solution for you.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={handleFindCare}
              className="bg-brand-dark hover:bg-brand-secondary shadow-brand-dark/10 w-full rounded-xl px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all sm:w-auto"
            >
              Find Care Now
            </button>
            <button
              onClick={handleApplyProfessional}
              className="text-brand-dark border-brand-dark/10 w-full rounded-xl border bg-white px-8 py-4 text-sm font-semibold transition-all hover:bg-slate-50 sm:w-auto"
            >
              Apply as Professional
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

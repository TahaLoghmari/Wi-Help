export function TrustLogosSection() {
  return (
    <section className="border-y border-slate-100 bg-white/50 py-10">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-6 text-xs font-medium tracking-wider text-slate-400 uppercase">
          Verified professionals from top institutions
        </p>
        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale transition-all duration-500 hover:grayscale-0 lg:gap-20">
          <span className="font-geist text-xl font-bold tracking-tighter text-slate-800">
            ESSTST
          </span>
          <span className="font-geist text-xl font-bold tracking-tighter text-slate-800">
            CRESCENT
          </span>
          <span className="font-geist text-xl font-bold tracking-tighter text-slate-800">
            CLINIQUE
          </span>
          <span className="font-geist text-xl font-bold tracking-tighter text-slate-800">
            FACULTY
          </span>
          <span className="font-geist text-xl font-bold tracking-tighter text-slate-800">
            HEALTH
          </span>
        </div>
      </div>
    </section>
  );
}

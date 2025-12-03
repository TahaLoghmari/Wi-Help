import { useNavigate } from "@tanstack/react-router";
import { Search, Star, ShieldCheck, Clock } from "lucide-react";
import { ROUTE_PATHS } from "@/config/routes";

export function HeroSection() {
  const navigate = useNavigate();

  const handleFindProfessional = () => {
    navigate({ to: ROUTE_PATHS.AUTH.REGISTER });
  };

  const handleImCaregiver = () => {
    navigate({ to: ROUTE_PATHS.AUTH.REGISTER });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="border-brand-dark/10 text-brand-secondary mb-8 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium shadow-sm">
            <span className="bg-brand-teal flex h-2 w-2 animate-pulse rounded-full"></span>
            Now live across Greater Tunis
          </div>

          <h1 className="text-brand-dark mb-6 text-5xl leading-[1.05] font-semibold tracking-tight lg:text-7xl">
            Expert healthcare,
            <br />
            <span className="font-light text-slate-400">
              where you feel safest.
            </span>
          </h1>

          <p className="mb-10 max-w-lg text-lg leading-relaxed font-light text-slate-500">
            Tunisia's first verified marketplace for home care. Connect with
            licensed nurses and caregivers instantly. Book appointments, track
            visits, and pay securely.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleFindProfessional}
              className="bg-brand-teal text-brand-dark hover:bg-brand-light shadow-brand-teal/20 flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold shadow-xl transition-all"
            >
              Find a Professional
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={handleImCaregiver}
              className="text-brand-dark flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-medium transition-all hover:bg-slate-50"
            >
              I'm a Caregiver
            </button>
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-slate-400">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-slate-200">
                <img
                  src="https://i.pravatar.cc/100?img=32"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-slate-200">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-slate-200">
                <img
                  src="https://i.pravatar.cc/100?img=5"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <p>Trusted by 2,000+ Tunisian families</p>
          </div>
        </div>

        {/* Hero Visual - Interactive Mockups */}
        <div className="relative flex w-full items-center justify-center lg:h-[600px] lg:justify-end">
          {/* Abstract Background Blob */}
          <div className="from-brand-blue/10 via-brand-teal/10 absolute top-1/2 left-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr to-transparent opacity-60 blur-3xl"></div>

          {/* Floating Card: Profile */}
          <div className="shadow-brand-dark/10 relative z-10 w-80 -rotate-2 transform rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl transition-all duration-500 hover:rotate-0">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src="https://i.pravatar.cc/150?img=42"
                    alt="Nurse"
                    className="h-full w-full object-cover"
                  />
                  <div className="bg-brand-teal absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="text-brand-dark font-semibold">
                    Amel Ben Said
                  </h3>
                  <p className="text-xs text-slate-400">
                    State Registered Nurse
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="text-brand-cream fill-brand-cream h-3 w-3" />
                    <span className="text-xs font-medium text-slate-700">
                      4.9
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (128 reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-brand-light/20 flex h-8 w-8 items-center justify-center rounded-full">
                <ShieldCheck className="text-brand-dark h-4 w-4" />
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs">
                <span className="text-slate-500">Injection</span>
                <span className="text-brand-dark font-medium">20 TND</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs">
                <span className="text-slate-500">Wound Dressing</span>
                <span className="text-brand-dark font-medium">35 TND</span>
              </div>
            </div>

            <button className="bg-brand-dark hover:bg-brand-secondary w-full rounded-xl py-2.5 text-xs font-medium text-white transition-colors">
              Book Appointment
            </button>
          </div>

          {/* Floating Card: Booking Status */}
          <div className="bg-brand-dark absolute -bottom-6 left-0 z-20 w-64 rotate-3 transform rounded-2xl border border-white/10 p-4 text-white shadow-xl transition-all duration-500 hover:rotate-0 lg:left-12">
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-brand-teal/20 text-brand-teal flex h-8 w-8 items-center justify-center rounded-full">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-brand-teal text-xs font-medium">
                  Coming Up
                </div>
                <div className="text-sm font-semibold">Today, 14:30</div>
              </div>
            </div>
            <div className="my-3 h-px w-full bg-white/10"></div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Physiotherapy</span>
              <span className="rounded bg-white/10 px-2 py-0.5 text-white">
                Confirmed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

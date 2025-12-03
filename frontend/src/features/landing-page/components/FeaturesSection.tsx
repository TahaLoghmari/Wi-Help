import {
  HeartPulse,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl md:text-center">
          <span className="text-brand-blue text-sm font-medium tracking-tight">
            The Ecosystem
          </span>
          <h2 className="text-brand-dark mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            One platform.
            <br />
            Two seamless journeys.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Patient Card */}
          <div
            id="patients"
            className="group hover:shadow-soft relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-[#f8f9fb] p-8 transition-all duration-300 md:p-12"
          >
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                <HeartPulse className="text-brand-blue h-6 w-6" />
              </div>
              <h3 className="text-brand-dark mb-4 text-2xl font-semibold">
                For Patients &amp; Families
              </h3>
              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  Browse verified profiles with real reviews.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  Manage medical identity (Conditions, Allergies).
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  Secure, transparent pricing before booking.
                </li>
              </ul>
              <a
                href="#"
                className="text-brand-dark border-brand-dark/20 hover:border-brand-dark inline-flex items-center border-b pb-0.5 text-sm font-medium transition-colors"
              >
                Find care near you <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>

            {/* UI Snippet for Patient */}
            <div className="shadow-card mt-12 translate-y-4 transform rounded-t-2xl border border-slate-100 bg-white p-4 transition-transform duration-500 group-hover:translate-y-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-brand-blue/10 text-brand-blue flex h-10 w-10 items-center justify-center rounded-full font-semibold">
                  S
                </div>
                <div>
                  <div className="text-brand-dark text-sm font-medium">
                    Sarah's Health Profile
                  </div>
                  <div className="text-xs text-slate-400">
                    Updated 2 days ago
                  </div>
                </div>
              </div>
              <div className="mb-3 flex gap-2">
                <span className="rounded-md border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600">
                  Type 2 Diabetes
                </span>
                <span className="rounded-md border border-orange-100 bg-orange-50 px-2 py-1 text-[10px] font-medium text-orange-600">
                  Penicillin Allergy
                </span>
              </div>
            </div>
          </div>

          {/* Professional Card */}
          <div
            id="professionals"
            className="group bg-brand-dark hover:shadow-soft relative overflow-hidden rounded-[2.5rem] border border-white/5 p-8 text-white transition-all duration-300 md:p-12"
          >
            <div className="bg-brand-teal/10 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 transform rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
                <Stethoscope className="text-brand-teal h-6 w-6" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-white">
                For Healthcare Pros
              </h3>
              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  Set your own service areas and schedule.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  Automated earnings tracking &amp; payouts.
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  Build reputation through verified quality scores.
                </li>
              </ul>
              <a
                href="#"
                className="text-brand-teal border-brand-teal/20 hover:border-brand-teal inline-flex items-center border-b pb-0.5 text-sm font-medium transition-colors"
              >
                Join network <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>

            {/* UI Snippet for Pro */}
            <div className="mt-12 translate-y-4 transform rounded-t-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-transform duration-500 group-hover:translate-y-2">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-slate-400">Total Earnings</div>
                  <div className="text-xl font-semibold text-white">
                    1,240{" "}
                    <span className="text-sm font-normal text-slate-400">
                      TND
                    </span>
                  </div>
                </div>
                <div className="bg-brand-teal/20 text-brand-teal rounded px-2 py-1 text-[10px] font-medium">
                  +18% this week
                </div>
              </div>
              <div className="flex h-12 items-end gap-1">
                <div className="h-[40%] flex-1 rounded-t-sm bg-white/10"></div>
                <div className="h-[60%] flex-1 rounded-t-sm bg-white/10"></div>
                <div className="bg-brand-teal h-[85%] flex-1 rounded-t-sm"></div>
                <div className="h-[50%] flex-1 rounded-t-sm bg-white/10"></div>
                <div className="h-[70%] flex-1 rounded-t-sm bg-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

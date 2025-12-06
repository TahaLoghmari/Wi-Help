import {
  Shield,
  GraduationCap,
  FileBadge,
  Umbrella,
  FileCheck,
  CheckCircle,
  Check,
} from "lucide-react";

export function TrustVerificationSection() {
  return (
    <section
      id="trust"
      className="border-y border-slate-200/50 bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <div className="lg:w-1/2">
            <div className="text-brand-dark mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              <Shield className="h-4 w-4" />
              Safety First
            </div>
            <h2 className="text-brand-dark mb-6 text-3xl font-semibold tracking-tight md:text-4xl">
              Verified Professionals.
              <br />
              Peace of mind.
            </h2>
            <p className="mb-8 leading-relaxed text-slate-500">
              Trust is our currency. Every professional on Wi-Help undergoes a
              rigorous 4-step verification process before they can accept a
              single booking.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-brand-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-brand-dark font-medium">
                    Diploma Verification
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    We authenticate medical degrees directly with issuing
                    institutions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-brand-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <FileBadge className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-brand-dark font-medium">
                    Professional License
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Valid practice permits and National ID cross-referencing.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-brand-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <Umbrella className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-brand-dark font-medium">
                    Liability Insurance
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Comprehensive coverage for both parties during care
                    delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            {/* Abstract Trust UI */}
            <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="bg-brand-teal/20 absolute -top-4 -right-4 h-20 w-20 rounded-full blur-xl"></div>

              <div className="mb-8 flex items-center justify-center">
                <div className="relative h-24 w-24 rounded-full bg-slate-100 p-1">
                  <img
                    src="https://i.pravatar.cc/150?img=68"
                    className="h-full w-full rounded-full object-cover grayscale"
                    alt="Professional"
                  />
                  <div className="bg-brand-teal absolute right-0 bottom-0 rounded-full border-4 border-white p-1.5 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="mb-8 text-center">
                <h3 className="text-brand-dark text-lg font-semibold">
                  Hana M.
                </h3>
                <div className="bg-brand-dark/5 text-brand-dark mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                  <span className="bg-brand-teal h-1.5 w-1.5 rounded-full"></span>{" "}
                  Verified Professional
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">National ID</span>
                  </div>
                  <CheckCircle className="text-brand-teal h-4 w-4" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Nursing Diploma
                    </span>
                  </div>
                  <CheckCircle className="text-brand-teal h-4 w-4" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Professional License
                    </span>
                  </div>
                  <CheckCircle className="text-brand-teal h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

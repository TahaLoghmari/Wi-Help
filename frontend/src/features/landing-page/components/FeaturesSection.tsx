import {
  HeartPulse,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Activity,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section id="features" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl md:text-center">
          <span className="text-brand-blue text-sm font-medium tracking-tight">
            {t("landing.features.ecosystem")}
          </span>
          <h2 className="text-brand-dark mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            {t("landing.features.title")}
            <br />
            {t("landing.features.subtitle")}
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
                {t("landing.features.patient.title")}
              </h3>
              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  {t("landing.features.patient.feature1")}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  {t("landing.features.patient.feature2")}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  {t("landing.features.patient.feature3")}
                </li>
              </ul>
              <a
                href="#"
                className="text-brand-dark border-brand-dark/20 hover:border-brand-dark inline-flex items-center border-b pb-0.5 text-sm font-medium transition-colors"
              >
                {t("landing.features.patient.link")}{" "}
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>

            {/* UI Snippet for Patient */}
            <div className="mb-3 shadow-soft mt-12 translate-y-8 transform rounded-2xl border border-white/50 bg-white/80 pt-6 pr-6 pb-6 pl-6 backdrop-blur-xl transition-transform duration-500 ease-out will-change-transform group-hover:translate-y-4">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://i.pravatar.cc/150?img=38"
                      alt="Sarah"
                      className="h-11 w-11 rounded-full object-cover shadow-sm ring-2 ring-white"
                    />
                    <div className="bg-brand-teal absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="text-white"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-brand-dark text-sm font-semibold">
                      {t("landing.features.patient.profileName")}
                    </h4>
                    <p className="bg-brand-bg mt-0.5 inline-block rounded border border-slate-100/50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      {t("landing.features.patient.profileId")}
                    </p>
                  </div>
                </div>
                <div className="flex -space-x-1.5">
                  <span className="bg-brand-blue h-2 w-2 animate-pulse rounded-full"></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brand-bg group/card hover:border-brand-teal/30 flex flex-col justify-between gap-2 rounded-xl border border-slate-100 p-3 transition-colors">
                  <div className="bg-brand-cream text-brand-secondary flex h-8 w-8 items-center justify-center rounded-lg">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                      {t("landing.features.patient.nextCare")}
                    </span>
                    <span className="text-brand-dark mt-0.5 block text-xs font-bold">
                      {t("landing.features.patient.nextCareTime")}
                    </span>
                  </div>
                </div>

                <div className="bg-brand-bg group/card hover:border-brand-blue/30 flex flex-col justify-between gap-2 rounded-xl border border-slate-100 p-3 transition-colors">
                  <div className="bg-brand-blue/10 text-brand-blue flex h-8 w-8 items-center justify-center rounded-lg">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                      {t("landing.features.patient.vitals")}
                    </span>
                    <span className="text-brand-dark mt-0.5 block text-xs font-bold">
                      {t("landing.features.patient.vitalsStatus")}
                    </span>
                  </div>
                </div>
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
                {t("landing.features.professional.title")}
              </h3>
              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  {t("landing.features.professional.feature1")}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  {t("landing.features.professional.feature2")}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="text-brand-teal h-5 w-5 shrink-0" />
                  {t("landing.features.professional.feature3")}
                </li>
              </ul>
              <a
                href="#"
                className="text-brand-teal border-brand-teal/20 hover:border-brand-teal inline-flex items-center border-b pb-0.5 text-sm font-medium transition-colors"
              >
                {t("landing.features.professional.link")}{" "}
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>

            {/* UI Snippet for Pro */}
            <div className="mt-12 translate-y-4 transform rounded-t-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-transform duration-500 group-hover:translate-y-2">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-slate-400">
                    {t("landing.features.professional.totalEarnings")}
                  </div>
                  <div className="text-xl font-semibold text-white">
                    1,240{" "}
                    <span className="text-sm font-normal text-slate-400">
                      {t("landing.features.professional.currency")}
                    </span>
                  </div>
                </div>
                <div className="bg-brand-teal/20 text-brand-teal rounded px-2 py-1 text-[10px] font-medium">
                  {t("landing.features.professional.earningsGrowth")}
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

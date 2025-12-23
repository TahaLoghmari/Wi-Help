import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { ROUTE_PATHS } from "@/config/routes";
import { useTranslation } from "react-i18next";

export function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFindProfessional = () => {
    navigate({ to: ROUTE_PATHS.AUTH.REGISTER });
  };

  const handleImCaregiver = () => {
    navigate({ to: ROUTE_PATHS.AUTH.REGISTER });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24">
      <div className="mx-auto grid max-w-[1300px] items-center gap-30 px-6 lg:grid-cols-2">
        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="border-brand-dark/10 text-brand-secondary mb-8 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium shadow-sm">
            <span className="bg-brand-teal flex h-2 w-2 animate-pulse rounded-full"></span>
            {t("landing.hero.badge")}
          </div>

          <h1 className="text-brand-dark mb-6 text-5xl leading-[1.05] font-semibold tracking-tight lg:text-7xl">
            {t("landing.hero.title")}
            <br />
            <span className="font-light text-slate-400">
              {t("landing.hero.subtitle")}
            </span>
          </h1>

          <p className="mb-10 max-w-lg text-lg leading-relaxed font-light text-slate-500">
            {t("landing.hero.description")}
          </p>
          <div className="mb-6 flex items-center gap-2">
            <div className="uui-button-wrapper">
              <a href="#" target="_blank" className="w-inline-block">
                <img
                  src="https://cdn.prod.website-files.com/642eb7fb48d9b60d4759b72b/64f892a2c8d296bf4f3b0998_Apple%20Store%20Badge.png"
                  loading="lazy"
                  data-w-id="16917e0b-3894-d0e7-3008-d770feeedeab"
                  width="132"
                  alt="Download from apple store"
                />
              </a>
            </div>
            <div className="uui-button-wrapper">
              <a href="#" target="_blank" className="w-inline-block">
                <img
                  src="https://cdn.prod.website-files.com/642eb7fb48d9b60d4759b72b/64f892a2c8d296bf4f3b099a_Google%20Store%20Badge.png"
                  loading="lazy"
                  data-w-id="16917e0b-3894-d0e7-3008-d770feeedeaf"
                  width="148.5"
                  alt="Get it on google play"
                />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleFindProfessional}
              className="bg-brand-teal text-brand-dark hover:bg-brand-teal/80 shadow-brand-teal/20 flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold shadow-xl transition-all"
            >
              {t("landing.hero.findProfessional")}
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={handleImCaregiver}
              className="text-brand-dark flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-medium transition-all hover:bg-slate-50"
            >
              {t("landing.hero.imCaregiver")}
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
            <p>{t("landing.hero.trustedBy")}</p>
          </div>
        </div>

        {/* Hero Visual - Interactive Mockups */}
        <div className="perspective-1000 relative flex w-full items-center justify-center select-none lg:h-[600px]">
          <div className="absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr from-blue-50 via-teal-50/50 to-transparent opacity-60 blur-3xl"></div>

          <div className="relative z-10 flex h-[450px] w-[320px] items-end justify-center md:h-[550px] md:w-[380px]">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&amp;w=1000&amp;auto=format&amp;fit=crop"
              alt="Doctor"
              className="shadow-brand-dark/10 mask-gradient-b h-full w-full rounded-4xl object-cover shadow-2xl"
            />
          </div>

          <div className="shadow-card animate-float absolute top-12 -right-4 z-30 w-64 rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl lg:-right-6 scale-[0.65] origin-top-right md:scale-100">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-geist text-xs font-medium text-slate-500">
                {t("landing.hero.totalRevenue")}
              </h4>
              <span className="rounded-full bg-green-100/80 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                {t("landing.hero.revenueGrowth")}
              </span>
            </div>
            <div className="mb-1 flex items-baseline gap-1">
              <span className="text-brand-dark font-geist text-2xl font-semibold tracking-tight">
                {t("landing.hero.revenueAmount")}
              </span>
              <span className="font-geist text-sm font-normal text-slate-400">
                {t("landing.hero.currency")}
              </span>
            </div>
            <div className="font-geist mb-4 text-[10px] text-slate-400">
              {t("landing.hero.revenueComparison")}
            </div>
            <div className="mt-2 flex h-12 items-end gap-1.5">
              <div className="bg-brand-teal/20 h-[40%] w-full rounded-sm"></div>
              <div className="bg-brand-teal/20 h-[60%] w-full rounded-sm"></div>
              <div className="bg-brand-teal/20 h-[30%] w-full rounded-sm"></div>
              <div className="bg-brand-teal/40 h-[50%] w-full rounded-sm"></div>
              <div className="bg-brand-teal/60 h-[70%] w-full rounded-sm"></div>
              <div className="bg-brand-teal h-[85%] w-full rounded-sm"></div>
              <div className="bg-brand-teal/80 h-[65%] w-full rounded-sm"></div>
            </div>
          </div>

          <div className="shadow-card animate-float-delayed absolute top-20 -left-4 z-20 w-52 rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl lg:-left-12 scale-[0.65] origin-top-left md:scale-100">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h4 className="font-geist mb-1 text-xs font-medium text-slate-500">
                  {t("landing.hero.activePatients")}
                </h4>
                <div className="text-brand-dark font-geist text-3xl font-semibold tracking-tight">
                  {t("landing.hero.patientsCount")}
                </div>
              </div>
              <div className="bg-brand-teal/10 flex h-6 w-6 items-center justify-center rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-lucide="users"
                  className="lucide lucide-users text-brand-teal h-3.5 w-3.5"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="from-brand-teal to-brand-blue h-full w-[70%] rounded-full bg-linear-to-r"></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <span className="text-brand-teal">
                {t("landing.hero.newPatients")}
              </span>{" "}
              {t("landing.hero.newPatientsText")}
            </div>
          </div>
          <div className="shadow-card animate-float-reverse absolute bottom-16 -left-2 z-30 w-60 rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl lg:-left-6 scale-[0.65] origin-bottom-left md:scale-100">
            <h4 className="font-geist mb-3 text-xs font-medium text-slate-500">
              {t("landing.hero.scheduleHeatmap")}
            </h4>
            <div className="mb-4 grid grid-cols-8 gap-1">
              <div className="bg-brand-teal/10 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/20 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/40 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/60 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/80 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/60 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/30 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/10 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/30 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/50 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/80 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/40 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/20 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/5 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/10 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/30 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/50 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/40 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/20 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/10 h-1.5 rounded-[1px]"></div>
              <div className="bg-brand-teal/5 h-1.5 rounded-[1px]"></div>
            </div>
            <div className="font-geist flex items-center justify-between text-[11px]">
              <span className="text-brand-dark font-medium">
                {t("landing.hero.scheduleDay")}
              </span>
              <span className="text-slate-400">
                {t("landing.hero.scheduleTime")}
              </span>
            </div>
          </div>

          <div className="shadow-card animate-float-slow absolute -right-4 bottom-20 z-20 w-64 rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl lg:-right-8 scale-[0.65] origin-bottom-right md:scale-100">
            <h4 className="font-geist mb-4 text-xs font-medium text-slate-500">
              {t("landing.hero.serviceTrends")}
            </h4>
            <div className="relative mb-3 h-12 w-full">
              <svg
                viewBox="0 0 100 40"
                className="preserve-3d h-full w-full overflow-visible"
              >
                <path
                  d="M0 35 Q 20 20 40 25 T 80 10 L 100 5"
                  fill="none"
                  stroke="#14d3ac"
                  stroke-width="2"
                  stroke-linecap="round"
                  vector-effect="non-scaling-stroke"
                ></path>
                <path
                  d="M0 38 Q 20 30 40 32 T 80 25 L 100 20"
                  fill="none"
                  stroke="#3fa6ff"
                  stroke-width="2"
                  stroke-linecap="round"
                  opacity="0.4"
                  vector-effect="non-scaling-stroke"
                ></path>
              </svg>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="bg-brand-teal h-1.5 w-1.5 rounded-full"></div>
                <span className="text-[10px] font-medium text-slate-500">
                  {t("landing.hero.nursing")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="bg-brand-blue/50 h-1.5 w-1.5 rounded-full"></div>
                <span className="text-[10px] font-medium text-slate-500">
                  {t("landing.hero.physio")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

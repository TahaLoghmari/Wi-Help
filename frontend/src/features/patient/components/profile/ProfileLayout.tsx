import { useState } from "react";
import { GetCurrentPatient } from "@/features/patient";
import { PatientProfile } from "@/features/patient";
import { PatientReviewsList } from "@/features/reviews";
import { Avatar, AvatarFallback, AvatarImage, Spinner } from "@/components/ui";
import { ShieldCheck, User } from "lucide-react";
import { useTranslation } from "react-i18next";

type TabType = "overview" | "reviews";

export function ProfileLayout() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const { data: patient, isLoading, isError } = GetCurrentPatient();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        {t("patient.profile.error")}
      </div>
    );
  }

  const patientInitials =
    patient?.firstName && patient?.lastName
      ? patient.firstName.charAt(0).toUpperCase() +
        patient.lastName.charAt(0).toUpperCase()
      : "U";

  return (
    <section className="mb-6 flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
      {/* Profile Header Card */}
      <div className="border-brand-dark/10 relative overflow-hidden rounded-2xl border bg-white">
        {/* Cover / decorative top */}
        <div className="bg-brand-dark relative h-28 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        <div className="px-5 pb-5">
          <div className="flex flex-col items-start gap-5 sm:flex-row">
            {/* Avatar */}
            <div className="relative -mt-12 h-24 w-24 shrink-0">
              <Avatar className="h-24 w-24 border-4 border-white bg-white">
                <AvatarImage
                  className="object-cover"
                  src={patient?.profilePictureUrl}
                  alt={patient?.firstName}
                />
                <AvatarFallback className="rounded-full text-lg">
                  {patientInitials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1 space-y-1 pt-3">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-brand-dark flex items-center gap-2 text-xl font-bold tracking-tight">
                    {patient?.gender === "male" ? "Mr" : "Ms"}.{" "}
                    {patient?.firstName} {patient?.lastName}
                    <ShieldCheck className="fill-brand-blue/10 text-brand-blue h-5 w-5" />
                  </h2>
                  <p className="text-brand-secondary text-sm">
                    {t("patient.profile.title")}
                  </p>
                </div>
              </div>

              {/* Key Stats Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="border-brand-dark/10 bg-brand-bg text-brand-secondary flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                  <User className="text-brand-secondary h-3.5 w-3.5" />
                  <span className="text-brand-dark font-medium">
                    {patient?.gender
                      ? patient.gender.charAt(0).toUpperCase() +
                        patient.gender.slice(1).toLowerCase()
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-slate-200 px-1">
        <div className="flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`profile-tab relative py-3 transition-colors ${
              activeTab === "overview"
                ? "text-brand-dark font-semibold"
                : "hover:text-brand-dark text-slate-500"
            }`}
          >
            {t("patient.profile.tabs.overview")}
            <span
              className={`bg-brand-dark absolute bottom-0 left-0 h-0.5 w-full ${
                activeTab === "overview" ? "" : "hidden"
              }`}
            ></span>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`profile-tab relative py-3 transition-colors ${
              activeTab === "reviews"
                ? "text-brand-dark font-semibold"
                : "hover:text-brand-dark text-slate-500"
            }`}
          >
            {t("patient.profile.tabs.reviews")}
            <span
              className={`bg-brand-dark absolute bottom-0 left-0 h-0.5 w-full ${
                activeTab === "reviews" ? "" : "hidden"
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <PatientProfile patient={patient} showHeader={false} />
      )}
      {activeTab === "reviews" && patient && (
        <PatientReviewsList patientId={patient.id} />
      )}
    </section>
  );
}

{
  /* <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100">
  <div className="mb-2 flex items-center justify-between">
    <h3 className="text-xs font-semibold tracking-tight text-brand-dark">
      Status &amp; Availability
    </h3>
  </div>
  <div className="mb-3 flex items-center justify-between">
    <span className="flex items-center gap-2 text-[11px] text-slate-700">
      <span className="inline-flex h-5 w-9 items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-0.5">
        <span className="inline-flex h-4 w-4 translate-x-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm"></span>
      </span>
      <span className="font-medium text-slate-900">Go Online</span>
    </span>
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
      Active
    </span>
  </div>
  <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
    <div className="mb-2 flex items-center justify-between text-[11px] text-slate-700">
      <span className="flex items-center gap-2">
        <svg
          data-lucide="calendar-clock"
          className="h-3.5 w-3.5 text-slate-500"
          strokeWidth="1.5"
        ></svg>
        Weekly Availability
      </span>
      <span className="text-[10px] text-slate-500">Mon–Fri • 09:00–17:00</span>
    </div>
    <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Mon
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Tue
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Wed
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Thu
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Fri
      </span>
    </div>
  </div>

  <div className="space-y-2 text-[11px] text-slate-700">
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <svg
          data-lucide="map-pin"
          className="h-3.5 w-3.5 text-slate-500"
          strokeWidth="1.5"
        ></svg>
        Service area
      </span>
      <span className="text-slate-500">
        Within <span className="font-semibold text-slate-900">10 km</span>
      </span>
    </div>
    <div className="flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[10px] text-slate-400">
      Map preview
    </div>
  </div>
</section>; */
}

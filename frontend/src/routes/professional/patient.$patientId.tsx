import { useState } from "react";
import { ContentLoading } from "@/components";
import { ROUTE_PATHS } from "@/config";
import { PatientProfile, GetPatient } from "@/features/patient";
import { PatientReviewsList } from "@/features/reviews";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { ShieldCheck, User, ArrowLeft, Navigation2 } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useCurrentUser } from "@/features/auth";

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.PATIENT_PROFILE)({
  component: PatientProfileRoute,
  pendingComponent: ContentLoading,
});

type TabType = "overview" | "reviews";

function PatientProfileRoute() {
  const { t } = useTranslation();
  const router = useRouter();
  const { patientId } = useParams({ strict: false });
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const { data: currentUser } = useCurrentUser();
  const {
    data: patient,
    isLoading,
    isError,
  } = GetPatient({
    patientId: patientId!,
    requesterLatitude: currentUser?.location?.latitude,
    requesterLongitude: currentUser?.location?.longitude,
  });

  if (isLoading) {
    return <ContentLoading />;
  }

  if (isError) {
    return <div>Patient not found or error loading patient.</div>;
  }

  const patientInitials =
    patient?.firstName && patient?.lastName
      ? patient.firstName.charAt(0).toUpperCase() +
        patient.lastName.charAt(0).toUpperCase()
      : "U";

  return (
    <section className="mb-6 flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
      <button
        onClick={() => router.history.back()}
        className="group border-brand-dark/20 bg-brand-bg text-brand-secondary hover:border-brand-dark/40 hover:text-brand-dark my-6 mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-all hover:bg-white active:scale-95"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        {t("patient.profile.back")}
      </button>

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
                {patient?.distanceKm !== undefined &&
                  patient?.distanceKm !== null && (
                    <div className="text-brand-blue flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium">
                      <Navigation2 className="h-3.5 w-3.5" />
                      <span>
                        {patient.distanceKm}{" "}
                        {t("professional.patientProfile.kmAway", "km away")}
                      </span>
                    </div>
                  )}
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
        <PatientProfile
          patient={patient}
          showBackButton={false}
          showHeader={false}
        />
      )}
      {activeTab === "reviews" && <PatientReviewsList patientId={patientId!} />}
    </section>
  );
}

import { GetPatientProfessionals } from "@/features/patient";
import { useNavigate, Link } from "@tanstack/react-router";
import { Spinner, EmptyState, Avatar, AvatarImage, AvatarFallback } from "@/components";
import { ROUTE_PATHS } from "@/config";
import { getSpecializations } from "@/features/auth/lib/authConstants";
import { useTranslation } from "react-i18next";
import { User } from "lucide-react";

export function MyProfessionalsCards() {
  const { t, i18n } = useTranslation();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetPatientProfessionals();

  const professionals = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;
  const navigate = useNavigate();

  const calculateAge = (dob: string) => {
    if (!dob) return t("common.notAvailable");
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  };

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
        {t("patient.professionals.error")}
      </div>
    );
  }

  if (!professionals || professionals.length === 0) {
    return (
      <div className="col-span-full flex h-[50vh] flex-col items-center justify-center">
        <EmptyState
          icon={User}
          title={t("patient.professionals.emptyState.title")}
          description={t("patient.professionals.emptyState.description")}
          action={{
            label: t("patient.professionals.emptyState.action"),
            onClick: () => navigate({ to: ROUTE_PATHS.PATIENT.FINDPROFESSIONAL }),
          }}
          className="border-none bg-transparent shadow-none"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
      {professionals.map((professional, index) => (
        <article
          key={index}
          className="hover:border-brand-blue/70 flex h-45 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 transition-all hover:shadow-md hover:shadow-slate-100"
        >
          <div className="items:center flex gap-3">
            <Avatar className="h-10 w-10 border-4 border-white bg-white">
                <AvatarImage
                  className="object-cover"
                  src={professional?.profilePictureUrl}
                  alt={professional?.firstName}
                />
                <AvatarFallback className="rounded-full text-lg">
                  {professional?.firstName && professional?.lastName
                    ? professional.firstName.charAt(0).toUpperCase() +
                      professional.lastName.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-xs font-medium tracking-tight text-slate-900">
                  Dr. {professional.firstName} {professional.lastName}
                </h4>
                <span className="border-brand-cream bg-brand-cream/60 text-brand-dark inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px]">
                  ID: #{professional.id.substring(0, 8)}
                </span>
              </div>
              <p className="truncate text-[11px] text-slate-500">
                {calculateAge(professional.dateOfBirth)} yrs •{" "}
                {professional.gender.charAt(0).toUpperCase() +
                  professional.gender.slice(1)}{" "}
                • {professional.address?.city || t("common.unknown")} •{" "}
                {professional.address?.state || t("common.unknown")}
              </p>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 border-b border-dashed border-slate-200 pb-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-phone h-3.5 w-3.5 text-slate-400"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className="font-medium">
                +216 {professional.phoneNumber}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail h-3.5 w-3.5 text-slate-400"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="truncate font-medium">{professional.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-briefcase h-3.5 w-3.5 text-slate-400"
              >
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span className="font-medium text-slate-700">
                {professional.experience} {t("patient.professionals.years")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-stethoscope h-3.5 w-3.5 text-slate-400"
              >
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
              <span className="font-medium text-slate-700">
                {getSpecializations(i18n.language).find(
                  (spec) => spec.value === professional.specialization,
                )?.label || professional.specialization}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Link
              to={ROUTE_PATHS.PATIENT.MESSAGES}
              className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="message-circle"
                className="lucide lucide-message-circle h-3.5 w-3.5 text-slate-500"
              >
                <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path>
              </svg>
              {t("patient.professionals.message")}
            </Link>
            <button
              onClick={() =>
                navigate({
                  to: "/patient/professional/$professionalId",
                  params: { professionalId: professional.id },
                })
              }
              className="bg-brand-dark hover:bg-brand-secondary inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="user"
                className="lucide lucide-user h-3.5 w-3.5 text-white"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {t("patient.professionals.viewProfile")}
            </button>
          </div>
        </article>
      ))}

      <div className="col-span-full mt-4 flex items-center justify-between">
        <div className="text-[11px] text-slate-500">
          Showing
          <span className="font-medium text-slate-700">
            {" "}
            {professionals.length}{" "}
          </span>
          of
          <span className="font-medium text-slate-700"> {totalCount} </span>
          professionals.
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage
              ? t("patient.professionals.pagination.loadingMore")
              : hasNextPage
                ? t("patient.professionals.pagination.loadMore")
                : t("patient.professionals.pagination.noMore")}
          </button>
        </div>
      </div>
    </div>
  );
}

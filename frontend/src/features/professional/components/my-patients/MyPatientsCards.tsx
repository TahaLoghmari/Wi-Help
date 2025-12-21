import { GetProfessionalPatients } from "@/features/professional";
import { useNavigate, Link } from "@tanstack/react-router";
import { Spinner, EmptyState } from "@/components";
import { ROUTE_PATHS } from "@/config";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";

export function MyPatientsCards() {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetProfessionalPatients();

  const patients = data?.pages.flatMap((page) => page.items) || [];
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
        {t("professional.myPatients.error")}
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="col-span-full flex h-[50vh] flex-col items-center justify-center">
        <EmptyState
          icon={Users}
          title={t("professional.myPatients.emptyState.title")}
          description={t("professional.myPatients.emptyState.description")}
          className="border-none bg-transparent shadow-none"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {patients.map((patient, index) => (
        <article
          key={index}
          className="hover:border-brand-blue/70 flex h-45 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 transition-all hover:shadow-md hover:shadow-slate-100"
        >
          <div className="items:center flex gap-3">
            <img
              src={patient.profilePictureUrl}
              alt={t("professional.myPatients.card.patientAlt")}
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-xs font-medium tracking-tight text-slate-900">
                  {patient.firstName} {patient.lastName}
                </h4>
                <span className="border-brand-cream bg-brand-cream/60 text-brand-dark inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px]">
                  {t("professional.myPatients.card.id")}
                  {patient.id.substring(0, 8)}
                </span>
              </div>
              <p className="truncate text-[11px] text-slate-500">
                {calculateAge(patient.dateOfBirth)}{" "}
                {t("professional.myPatients.card.years")} •{" "}
                {patient.gender.charAt(0).toUpperCase() +
                  patient.gender.slice(1)}{" "}
                •{" "}
                {patient.address?.city ||
                  t("professional.myPatients.card.unknown")}{" "}
                •{" "}
                {patient.address?.state ||
                  t("professional.myPatients.card.unknown")}
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1 border-b border-dashed border-slate-200 pb-2 text-[11px] text-slate-600">
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
              <span className="">+216 {patient.phoneNumber}</span>
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
              <span className="truncate">{patient.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to={ROUTE_PATHS.PROFESSIONAL.MESSAGES}
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
              {t("professional.myPatients.card.message")}
            </Link>
            <button
              onClick={() =>
                navigate({
                  to: "/professional/patient/$patientId",
                  params: { patientId: patient.id },
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
              {t("professional.myPatients.card.viewProfile")}
            </button>
          </div>
        </article>
      ))}

      <div className="col-span-full mt-4 flex items-center justify-between">
        <div className="text-[11px] text-slate-500">
          {t("professional.myPatients.pagination.showing")}
          <span className="font-medium text-slate-700">
            {" "}
            {patients.length}{" "}
          </span>
          {t("professional.myPatients.pagination.of")}
          <span className="font-medium text-slate-700"> {totalCount} </span>
          {t("professional.myPatients.pagination.patients")}
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage
              ? t("professional.myPatients.pagination.loadingMore")
              : hasNextPage
                ? t("professional.myPatients.pagination.loadMore")
                : t("professional.myPatients.pagination.noMore")}
          </button>
        </div>
      </div>
    </div>
  );
}

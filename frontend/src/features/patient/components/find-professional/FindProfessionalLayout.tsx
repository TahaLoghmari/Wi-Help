import { FindProfessionalFilterbar } from "@/features/patient";
import {
  GetProfessionals,
  type GetProfessionalsDto,
} from "@/features/professional";
import { Avatar, AvatarFallback, AvatarImage, Spinner } from "@/components/ui";
import { CalendarPlus, MapPin, Navigation2, User } from "lucide-react";
import { getSpecializations } from "@/features/auth";
import { Link } from "@tanstack/react-router";
import { useAppNavigation } from "@/hooks";
import { GetProfessionalReviewStats, StarRating } from "@/features/reviews";
import { useTranslation } from "react-i18next";

interface ProfessionalCardProps {
  professional: GetProfessionalsDto;
}

function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useAppNavigation();
  const { data: reviewStats } = GetProfessionalReviewStats(professional.id);

  return (
    <article
      key={professional.id}
      className="hover:border-brand-blue/70 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100 transition-all hover:shadow-md hover:shadow-slate-100"
    >
      <div className="flex w-full items-center justify-center">
        <Avatar className="mt-5 h-60 w-[90%] rounded-md border">
          <AvatarImage
            src={professional.profilePictureUrl}
            className="object-cover"
            alt={professional.firstName}
          />
          <AvatarFallback className="rounded-none">
            {professional.firstName.charAt(0).toUpperCase()}
            {professional.lastName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-xs font-medium tracking-tight text-slate-900">
              {professional.firstName} {professional.lastName}
            </h3>
            {professional.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                {t("patient.findProfessional.verified")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                {t("patient.findProfessional.pending")}
              </span>
            )}
          </div>
          <p className="truncate text-[11px] text-slate-500">
            {
              getSpecializations(i18n.language).find(
                (specialization) =>
                  specialization.value === professional.specialization,
              )?.label
            }
          </p>
        </div>

        <div className="flex flex-col gap-2 text-[11px]">
          <div className="flex items-center gap-0.5">
            <StarRating rating={reviewStats?.averageRating ?? 0} size="sm" />
            <span className="ml-1 font-medium text-slate-700">
              {(reviewStats?.averageRating ?? 0).toFixed(1)}
            </span>
            <span className="text-slate-400">
              ({reviewStats?.totalCount ?? 0})
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">
              {professional.address.city}, {professional.address.state}
            </span>
          </div>
          {professional.distanceKm !== undefined && professional.distanceKm !== null && (
            <div className="flex items-center gap-1 text-brand-blue font-medium">
              <Navigation2 className="h-3.5 w-3.5" />
              <span>{professional.distanceKm} km {t("patient.findProfessional.away", "away")}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              data-lucide="dollar-sign"
              className="lucide lucide-dollar-sign h-3.5 w-3.5 text-slate-500"
            >
              <path d="M176 176C176 211.3 147.3 240 112 240L112 400C147.3 400 176 428.7 176 464L464 464C464 428.7 492.7 400 528 400L528 240C492.7 240 464 211.3 464 176L176 176zM64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM320 208C381.9 208 432 258.1 432 320C432 381.9 381.9 432 320 432C258.1 432 208 381.9 208 320C208 258.1 258.1 208 320 208zM304 252C293 252 284 261 284 272C284 281.7 290.9 289.7 300 291.6L300 340L296 340C285 340 276 349 276 360C276 371 285 380 296 380L344 380C355 380 364 371 364 360C364 349 355 340 344 340L340 340L340 272C340 261 331 252 320 252L304 252z" />
            </svg>
            <span className="font-semibold">
              ${professional?.startPrice} – ${professional?.endPrice}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => navigate.goToBook(professional.id)}
            className="bg-brand-dark hover:bg-brand-secondary inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] text-white transition-colors"
          >
            <CalendarPlus className="h-3.5 w-3.5 text-white" />
            {t("patient.findProfessional.book")}
          </button>
          <Link
            to="/patient/professional/$professionalId"
            params={{ professionalId: professional.id }}
            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 transition-colors"
          >
            <User className="h-3.5 w-fit text-slate-500" />
            {t("patient.findProfessional.viewProfile")}
          </Link>
        </div>
      </div>
    </article>
  );
}

export function FindProfessionalLayout() {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetProfessionals();

  const professionals = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-auto bg-[#fafafb] px-8 py-5">
      <FindProfessionalFilterbar />
      {isLoading && (
        <div className="flex h-full w-full items-center justify-center p-8">
          <Spinner />
        </div>
      )}
      {isError && (
        <div className="p-4 text-center text-red-500">
          {t("patient.findProfessional.error")}
        </div>
      )}
      {!isLoading && !isError && (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
                {t("patient.findProfessional.title")}
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {t("patient.findProfessional.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-500">
                {t("patient.findProfessional.sort.label")}
              </span>
              <div className="relative">
                <select className="focus:border-brand-blue/70 focus:ring-brand-blue/60 appearance-none rounded-full border border-slate-200 bg-white px-3 py-1.5 pr-7 text-[11px] text-slate-700 focus:ring-1 focus:outline-none">
                  <option>
                    {t("patient.findProfessional.sort.recommended")}
                  </option>
                  <option>{t("patient.findProfessional.sort.rating")}</option>
                  <option>
                    {t("patient.findProfessional.sort.availability")}
                  </option>
                  <option>{t("patient.findProfessional.sort.price")}</option>
                </select>
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
                  className="lucide lucide-chevron-down pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {professionals?.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-[11px] text-slate-500">
              {t("patient.findProfessional.pagination.showing")}
              <span className="font-medium text-slate-700">
                {" "}
                {professionals.length}{" "}
              </span>
              {t("patient.findProfessional.pagination.of")}
              <span className="font-medium text-slate-700"> {totalCount} </span>
              {t("patient.findProfessional.pagination.professionals")}
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingNextPage
                  ? t("patient.findProfessional.pagination.loading")
                  : hasNextPage
                    ? t("patient.findProfessional.pagination.loadMore")
                    : t("patient.findProfessional.pagination.noMore")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

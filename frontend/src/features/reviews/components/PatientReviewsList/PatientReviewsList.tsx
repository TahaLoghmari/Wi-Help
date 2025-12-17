import { Spinner } from "@/components/ui";
import { StarRating } from "@/features/reviews";
import { GetPatientReviews, GetPatientReviewStats } from "@/features/reviews";
import { useCurrentUser } from "@/features/auth";
import { SubmitPatientReviewForm } from "@/features/reviews";
import { GetCurrentPatient } from "@/features/patient";
import { useTranslation } from "react-i18next";
import { PatientReviewCard } from "./PatientReviewCard";

interface PatientReviewsListProps {
  patientId: string;
}

export function PatientReviewsList({ patientId }: PatientReviewsListProps) {
  const { t } = useTranslation();
  const { data: currentUser } = useCurrentUser();
  const isProfessional = currentUser?.role?.toLowerCase() === "professional";
  const isPatient = currentUser?.role?.toLowerCase() === "patient";

  // Only fetch current patient if user is a patient to avoid unnecessary API calls
  const { data: currentPatient } = GetCurrentPatient();

  // Check if the current patient is viewing their own profile
  const isViewingOwnProfile = isPatient && currentPatient?.id === patientId;

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = GetPatientReviews({
    patientId,
    page: 1,
    pageSize: 10,
  });

  const { data: statsData, isLoading: isLoadingStats } =
    GetPatientReviewStats(patientId);

  if (isLoadingReviews || isLoadingStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }
  if (isErrorReviews) {
    return (
      <div className="p-4 text-center text-xs text-red-500">
        {t("reviews.error")}
      </div>
    );
  }

  const reviews = reviewsData?.items ?? [];
  const averageRating = statsData?.averageRating ?? 0;
  const totalCount = statsData?.totalCount ?? 0;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-brand-dark text-sm font-semibold tracking-tight">
            {t("reviews.patientReviewsTitle")}
          </h3>
          <p className="mt-0.5 max-w-xl text-[11px] text-slate-500">
            {t("reviews.patientReviewsDescription")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-slate-700">
            <StarRating rating={averageRating} size="sm" />
            <span className="ml-1 font-medium text-slate-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-slate-500">({totalCount})</span>
          </span>
        </div>
      </div>
      {reviews.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-xs text-slate-500">
            {t("reviews.patientReviewsEmpty")}
          </p>
        </div>
      ) : (
        <div className="space-y-3 pr-1">
          {reviews.map((review) => (
            <PatientReviewCard
              key={review.id}
              review={review}
              patientId={patientId}
              showReplyInput={isViewingOwnProfile}
            />
          ))}
        </div>
      )}
      {isProfessional && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <SubmitPatientReviewForm patientId={patientId} />
        </div>
      )}
    </section>
  );
}

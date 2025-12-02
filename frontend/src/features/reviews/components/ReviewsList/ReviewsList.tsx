import { Spinner } from "@/components/ui";
import { ReviewCard, StarRating } from "@/features/reviews";
import {
  GetProfessionalReviews,
  GetProfessionalReviewStats,
} from "@/features/reviews";
import { useCurrentUser } from "@/features/auth";
import { SubmitReviewForm } from "@/features/reviews";
import { GetCurrentProfessional } from "@/features/professional";

interface ReviewsListProps {
  professionalId: string;
}

export function ReviewsList({ professionalId }: ReviewsListProps) {
  const { data: currentUser } = useCurrentUser();
  const isPatient = currentUser?.role?.toLowerCase() === "patient";
  const isProfessional = currentUser?.role?.toLowerCase() === "professional";

  // Only fetch current professional if user is a professional to avoid unnecessary API calls
  const { data: currentProfessional } = GetCurrentProfessional();

  // Check if the current professional is viewing their own profile
  const isViewingOwnProfile =
    isProfessional && currentProfessional?.id === professionalId;

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = GetProfessionalReviews({
    professionalId,
    page: 1,
    pageSize: 10,
  });

  const { data: statsData, isLoading: isLoadingStats } =
    GetProfessionalReviewStats(professionalId);

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
        Error loading reviews. Please try again later.
      </div>
    );
  }

  const reviews = reviewsData?.items ?? [];
  const averageRating = statsData?.averageRating ?? 0;
  const totalCount = statsData?.totalCount ?? 0;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[#00394a]">
            Patient Reviews
          </h3>
          <p className="mt-0.5 max-w-xl text-[11px] text-slate-500">
            Read feedback from patients and see their experiences.
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
          <p className="text-xs text-slate-500">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                professionalId={professionalId}
                showReplyInput={isViewingOwnProfile}
              />
            ))}
          </div>
        </div>
      )}
      {isPatient && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SubmitReviewForm professionalId={professionalId} />
        </div>
      )}
    </section>
  );
}

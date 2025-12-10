import {
  useGetReviewsForAdmin,
  useDeleteReviewForAdmin,
} from "@/features/admin/hooks";
import { Button } from "@/components/ui/button";
import { Star, Trash2, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export function AdminReviewsTable() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetReviewsForAdmin();

  const deleteMutation = useDeleteReviewForAdmin();

  const reviews = data?.pages.flatMap((page) => page.items) || [];

  const handleDelete = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(reviewId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading reviews...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Error loading reviews
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
          <div className="mb-2">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              All Reviews
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage patient reviews for professionals.
            </p>
          </div>
        </div>

        <div className="min-h-[400px] overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-white">
              <tr className="border-b border-slate-200">
                <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Patient
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Professional
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Rating
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Description
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Date
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-[350px] px-4 text-center align-middle sm:px-5"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <MessageSquare className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700">
                          No reviews
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          No reviews found in the system.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/70">
                    <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                      <div className="flex items-center gap-3">
                        {review.patientProfilePicture ? (
                          <img
                            src={review.patientProfilePicture}
                            alt={review.patientName}
                            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                            {review.patientName?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {review.patientName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      <div className="flex items-center gap-3">
                        {review.professionalProfilePicture ? (
                          <img
                            src={review.professionalProfilePicture}
                            alt={review.professionalName}
                            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                            {review.professionalName?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {review.professionalName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-slate-700">
                          {review.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <p className="line-clamp-2 max-w-[300px] text-xs text-slate-600">
                        {review.description}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-500 sm:px-5">
                      {format(new Date(review.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {hasNextPage && (
          <div className="border-t border-slate-200 bg-slate-50 p-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load more reviews"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

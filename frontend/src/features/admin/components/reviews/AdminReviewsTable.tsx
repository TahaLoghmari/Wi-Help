import {
  useGetReviewsForAdmin,
  useDeleteReviewForAdmin,
} from "@/features/admin/hooks";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Star, Trash2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export function AdminReviewsTable() {
  const { t } = useTranslation();
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

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        {t("admin.reviews.table.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        {t("admin.reviews.table.error")}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-auto">
        <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
          <div className="mb-2">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              {t("admin.reviews.title")}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {t("admin.reviews.subtitle")}
            </p>
          </div>
        </div>

        <div className="min-h-[400px] overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-white">
              <tr className="border-b border-slate-200">
                <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  {t("admin.reviews.table.patient")}
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  {t("admin.reviews.table.professional")}
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  {t("admin.reviews.table.rating")}
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  {t("admin.reviews.table.description")}
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  {t("admin.reviews.table.date")}
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  {t("admin.reviews.table.actions")}
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
                          {t("admin.reviews.table.empty.title")}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {t("admin.reviews.table.empty.description")}
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("admin.reviews.deleteConfirm")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(review.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
              {isFetchingNextPage
                ? t("admin.reviews.loadingMore")
                : t("admin.reviews.loadMore")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

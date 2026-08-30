import { useCallback, useState } from "react";
import { useDeleteReply, useDeleteReview } from "@/entities/review";

export function useReviewDeletionWorkflow(
  subjectId: string,
  showUnexpectedError: () => void,
) {
  const deleteReviewMutation = useDeleteReview(subjectId);
  const deleteReplyMutation = useDeleteReply(subjectId);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<{
    reviewId: string;
    replyId: string;
  } | null>(null);

  const confirmReviewDelete = useCallback(() => {
    if (!reviewId) return;
    deleteReviewMutation.mutate(reviewId, {
      onSuccess: () => setReviewId(null),
      onError: () => {
        setReviewId(null);
        showUnexpectedError();
      },
    });
  }, [deleteReviewMutation, reviewId, showUnexpectedError]);

  const confirmReplyDelete = useCallback(() => {
    if (!replyTarget) return;
    deleteReplyMutation.mutate(replyTarget, {
      onSuccess: () => setReplyTarget(null),
      onError: () => {
        setReplyTarget(null);
        showUnexpectedError();
      },
    });
  }, [deleteReplyMutation, replyTarget, showUnexpectedError]);

  return {
    requestReviewDelete: setReviewId,
    requestReplyDelete: (targetReviewId: string, replyId: string) =>
      setReplyTarget({ reviewId: targetReviewId, replyId }),
    deletingReplyId: deleteReplyMutation.isPending
      ? (deleteReplyMutation.variables?.replyId ?? null)
      : null,
    reviewDialog: {
      visible: reviewId !== null,
      onConfirm: confirmReviewDelete,
      onDismiss: () => setReviewId(null),
      isLoading: deleteReviewMutation.isPending,
    },
    replyDialog: {
      visible: replyTarget !== null,
      onConfirm: confirmReplyDelete,
      onDismiss: () => setReplyTarget(null),
      isLoading: deleteReplyMutation.isPending,
    },
  };
}

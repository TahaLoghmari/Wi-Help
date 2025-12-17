import { useState } from "react";
import { Heart, Reply, Pencil, Trash2, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { StarRating, StarRatingInput } from "@/features/reviews";
import type { GetPatientReviewsDto } from "@/features/reviews";
import { formatDistanceToNow } from "date-fns";
import {
  useLikeReview,
  useUnlikeReview,
  useReplyToReview,
  useUpdateReview,
  useDeleteReview,
} from "@/features/reviews";
import { useCurrentUser } from "@/features/auth";
import { useTranslation } from "react-i18next";

interface PatientReviewCardProps {
  review: GetPatientReviewsDto;
  patientId?: string;
  showReplyInput?: boolean;
}

export function PatientReviewCard({
  review,
  showReplyInput = false,
}: PatientReviewCardProps) {
  const { t } = useTranslation();
  const { data: currentUser } = useCurrentUser();
  const isProfessional = currentUser?.role?.toLowerCase() === "professional";
  const isPatient = currentUser?.role?.toLowerCase() === "patient";
  const isOwner =
    isProfessional && currentUser?.id === review.professional.userId;

  const [replyText, setReplyText] = useState("");
  const [showReplyInputState, setShowReplyInputState] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);

  const { mutate: likeReview } = useLikeReview();
  const { mutate: unlikeReview } = useUnlikeReview();
  const { mutate: replyToReview, isPending: isReplying } = useReplyToReview();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  const professional = review.professional;
  const professionalInitials =
    professional.firstName && professional.lastName
      ? `${professional.firstName.charAt(0).toUpperCase()}${professional.lastName.charAt(0).toUpperCase()}`
      : "U";

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
  });

  const handleLike = () => {
    if (review.isLiked) {
      unlikeReview({ reviewId: review.id });
    } else {
      likeReview({ reviewId: review.id });
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    replyToReview(
      { reviewId: review.id, comment: replyText.trim() },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReplyInputState(false);
        },
      },
    );
  };

  const handleEdit = () => {
    if (!editComment.trim() || editRating < 1 || editRating > 5) return;
    updateReview(
      { reviewId: review.id, comment: editComment.trim(), rating: editRating },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setEditComment(review.comment);
    setEditRating(review.rating);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(t("reviews.deleteConfirm"))) {
      deleteReview({ reviewId: review.id });
    }
  };

  const canReply = isPatient && showReplyInput;
  const canLike = isPatient || isProfessional;

  return (
    <article className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 border border-slate-200">
            <AvatarImage
              className="object-cover"
              src={professional.profilePictureUrl}
              alt={professional.firstName}
            />
            <AvatarFallback className="text-[10px]">
              {professionalInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-tight text-slate-900">
                Dr. {professional.firstName} {professional.lastName}
              </span>
              {isEditing ? (
                <StarRatingInput value={editRating} onChange={setEditRating} />
              ) : (
                <StarRating rating={review.rating} size="sm" />
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOwner && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title={t("reviews.edit")}
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                title={t("reviews.delete")}
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </>
          )}
          <div className="text-[11px] text-slate-500">{timeAgo}</div>
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            className="focus:border-brand-blue focus:ring-brand-blue w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none focus:ring-1"
            rows={3}
            placeholder={t("reviews.writeReviewPlaceholder")}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors hover:bg-slate-50"
            >
              <X className="h-3 w-3" strokeWidth={1.5} />
              {t("common.cancel")}
            </button>
            <button
              onClick={handleEdit}
              disabled={isUpdating || !editComment.trim()}
              className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-3 w-3" strokeWidth={1.5} />
              {isUpdating ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-slate-700">
          {review.comment}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-slate-200 pt-2">
        <div className="flex items-center gap-2 text-[11px]">
          {canLike && (
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 transition-colors ${
                review.isLiked
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <Heart
                className={`h-3 w-3 ${review.isLiked ? "fill-current" : ""}`}
                strokeWidth={1.5}
              />
              <span className="font-medium">{review.likesCount}</span>
            </button>
          )}

          {canReply && !isEditing && (
            <button
              onClick={() => setShowReplyInputState(!showReplyInputState)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Reply className="h-3 w-3" strokeWidth={1.5} />
              <span className="font-medium">{t("reviews.replyAction")}</span>
            </button>
          )}
        </div>

        {review.repliesCount > 0 && (
          <span className="text-[11px] text-slate-500">
            {review.repliesCount}{" "}
            {review.repliesCount === 1
              ? t("reviews.replyAction")
              : t("reviews.replies")}
          </span>
        )}
      </div>

      {/* Reply Input */}
      {showReplyInputState && canReply && !isEditing && (
        <div className="space-y-2 border-t border-slate-200 pt-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={t("reviews.replyPlaceholder")}
            className="focus:border-brand-blue focus:ring-brand-blue w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none focus:ring-1"
            rows={2}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setReplyText("");
                setShowReplyInputState(false);
              }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors hover:bg-slate-50"
            >
              <X className="h-3 w-3" strokeWidth={1.5} />
              {t("common.cancel")}
            </button>
            <button
              onClick={handleReply}
              disabled={isReplying || !replyText.trim()}
              className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Reply className="h-3 w-3" strokeWidth={1.5} />
              {isReplying ? t("common.sending") : t("reviews.replyAction")}
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="space-y-2 border-t border-slate-200 pt-3">
          {review.replies.map((reply) => (
            <div key={reply.id} className="flex gap-2">
              <Avatar className="h-6 w-6 border border-slate-200">
                <AvatarImage
                  className="object-cover"
                  src={reply.userProfilePictureUrl}
                  alt={reply.userFirstName}
                />
                <AvatarFallback className="text-[9px]">
                  {reply.userFirstName?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50/50 p-2">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-slate-900">
                      {reply.userFirstName} {reply.userLastName}
                    </span>
                    {!reply.isProfessional && (
                      <span className="bg-brand-blue/10 text-brand-blue rounded-full px-1.5 py-0.5 text-[9px] font-medium">
                        {t("reviews.patientBadge")}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500">
                    {formatDistanceToNow(new Date(reply.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-700">
                  {reply.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

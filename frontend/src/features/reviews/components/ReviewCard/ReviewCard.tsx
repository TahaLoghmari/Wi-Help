import { useState } from "react";
import { Heart, Reply, Pencil, Trash2, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { StarRating, StarRatingInput } from "@/features/reviews";
import type { GetProfessionalReviewsDto } from "@/features/reviews";
import { formatDistanceToNow } from "date-fns";
import {
  useLikeReview,
  useUnlikeReview,
  useReplyToReview,
  useUpdateReview,
  useDeleteReview,
} from "@/features/reviews";
import { useCurrentUser } from "@/features/auth";

interface ReviewCardProps {
  review: GetProfessionalReviewsDto;
  professionalId?: string;
  showReplyInput?: boolean;
}

export function ReviewCard({
  review,
  showReplyInput = false,
}: ReviewCardProps) {
  const { data: currentUser } = useCurrentUser();
  const isProfessional = currentUser?.role?.toLowerCase() === "professional";
  const isPatient = currentUser?.role?.toLowerCase() === "patient";
  const isOwner = isPatient && currentUser?.id === review.patient.userId;

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

  const patient = review.patient;
  const patientInitials =
    patient.firstName && patient.lastName
      ? `${patient.firstName.charAt(0).toUpperCase()}${patient.lastName.charAt(0).toUpperCase()}`
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
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview({ reviewId: review.id });
    }
  };

  const canReply = isProfessional && showReplyInput;
  const canLike = isPatient || isProfessional;

  return (
    <article className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 border border-slate-200">
            <AvatarImage
              className="object-cover"
              src={patient.profilePictureUrl}
              alt={patient.firstName}
            />
            <AvatarFallback className="text-[10px]">
              {patientInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-tight text-slate-900">
                {patient.firstName} {patient.lastName}
              </span>
              {isEditing ? (
                <StarRatingInput value={editRating} onChange={setEditRating} />
              ) : (
                <StarRating rating={review.rating} size="sm" />
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              Follow-up visit •{" "}
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
                title="Edit review"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                title="Delete review"
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
            placeholder="Write your review..."
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors hover:bg-slate-50"
            >
              <X className="h-3 w-3" strokeWidth={1.5} />
              Cancel
            </button>
            <button
              onClick={handleEdit}
              disabled={isUpdating || !editComment.trim()}
              className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-3 w-3" strokeWidth={1.5} />
              {isUpdating ? "Saving..." : "Save"}
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
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 transition-colors ${
                review.isLiked
                  ? "border-brand-blue/70 bg-brand-blue/5 text-brand-blue"
                  : "hover:border-brand-blue/70 hover:bg-brand-blue/5 border-slate-200 bg-white text-slate-700"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${review.isLiked ? "fill-current" : ""}`}
                strokeWidth={1.5}
              />
              <span>Like</span>
            </button>
          )}
          {canReply && (
            <button
              onClick={() => setShowReplyInputState(!showReplyInputState)}
              className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700 transition-colors"
            >
              <Reply className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.5} />
              <span>Reply</span>
            </button>
          )}
        </div>
        <div className="text-[11px] text-slate-500">
          {review.likesCount} {review.likesCount === 1 ? "like" : "likes"} •{" "}
          {review.repliesCount}{" "}
          {review.repliesCount === 1 ? "reply" : "replies"}
        </div>
      </div>

      {/* Replies */}
      {review.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {review.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2 pl-8">
              <div className="mr-1 h-5 w-px bg-slate-200"></div>
              <div className="flex-1 rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-800">
                    {reply.isProfessional
                      ? `Reply from ${reply.userFirstName ? `Dr. ${reply.userFirstName} ${reply.userLastName || ""}`.trim() : "Professional"}`
                      : `${reply.userFirstName || ""} ${reply.userLastName || ""}`.trim() ||
                        "User"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDistanceToNow(new Date(reply.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-700">
                  {reply.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline reply input */}
      {showReplyInputState && canReply && (
        <div className="flex items-start gap-2 pl-8">
          <div className="mr-1 h-5 w-px bg-slate-200"></div>
          <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px]">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleReply();
                }
              }}
              className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
            />
            <button
              onClick={handleReply}
              disabled={isReplying || !replyText.trim()}
              className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center rounded-full px-2 py-0.5 text-[11px] text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReplying ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

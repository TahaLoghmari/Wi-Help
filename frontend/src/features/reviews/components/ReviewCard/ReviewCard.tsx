import { useState } from "react";
import { Heart, Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { StarRating } from "@/features/reviews";
import type { GetProfessionalReviewsDto } from "@/features/reviews";
import { formatDistanceToNow } from "date-fns";
import { useLikeReview, useUnlikeReview, useReplyToReview } from "@/features/reviews";
import { useCurrentUser } from "@/features/auth";

interface ReviewCardProps {
  review: GetProfessionalReviewsDto;
  professionalId: string;
  showReplyInput?: boolean;
}

export function ReviewCard({ review, professionalId, showReplyInput = false }: ReviewCardProps) {
  const { data: currentUser } = useCurrentUser();
  const isProfessional = currentUser?.role?.toLowerCase() === "professional";
  const isPatient = currentUser?.role?.toLowerCase() === "patient";

  const [replyText, setReplyText] = useState("");
  const [showReplyInputState, setShowReplyInputState] = useState(false);

  const { mutate: likeReview } = useLikeReview();
  const { mutate: unlikeReview } = useUnlikeReview();
  const { mutate: replyToReview, isPending: isReplying } = useReplyToReview();

  const patient = review.patient;
  const patientInitials =
    patient.firstName && patient.lastName
      ? `${patient.firstName.charAt(0).toUpperCase()}${patient.lastName.charAt(0).toUpperCase()}`
      : "U";

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true });

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

  const canReply = isProfessional && showReplyInput;
  const canLike = isPatient || isProfessional;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 border border-slate-200">
            <AvatarImage
              className="object-cover"
              src={patient.profilePictureUrl}
              alt={patient.firstName}
            />
            <AvatarFallback className="text-[10px]">{patientInitials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-900 tracking-tight">
                {patient.firstName} {patient.lastName}
              </span>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <div className="text-[11px] text-slate-500">
              Follow-up visit • {new Date(review.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">{timeAgo}</div>
      </div>

      {/* Content */}
      <p className="text-xs text-slate-700 leading-relaxed">{review.comment}</p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-slate-200 pt-2">
        <div className="flex items-center gap-2 text-[11px]">
          {canLike && (
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border transition-colors ${
                review.isLiked
                  ? "border-[#3fa6ff]/70 bg-[#3fa6ff]/5 text-[#3fa6ff]"
                  : "border-slate-200 bg-white text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${review.isLiked ? "fill-current" : ""}`}
                strokeWidth={1.5}
              />
              <span>Like</span>
            </button>
          )}
          {canReply && (
            <button
              onClick={() => setShowReplyInputState(!showReplyInputState)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-slate-200 bg-white text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5 transition-colors"
            >
              <Reply className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
              <span>Reply</span>
            </button>
          )}
        </div>
        <div className="text-[11px] text-slate-500">
          {review.likesCount} {review.likesCount === 1 ? "like" : "likes"} • {review.repliesCount}{" "}
          {review.repliesCount === 1 ? "reply" : "replies"}
        </div>
      </div>

      {/* Replies */}
      {review.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {review.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2 pl-8">
              <div className="h-5 w-px bg-slate-200 mr-1"></div>
              <div className="flex-1 rounded-xl bg-slate-50 px-3 py-2 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-800">
                    {reply.isProfessional
                      ? `Reply from ${reply.userFirstName ? `Dr. ${reply.userFirstName} ${reply.userLastName || ""}`.trim() : "Professional"}`
                      : `${reply.userFirstName || ""} ${reply.userLastName || ""}`.trim() || "User"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-700 leading-snug">{reply.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline reply input */}
      {showReplyInputState && canReply && (
        <div className="flex items-start gap-2 pl-8">
          <div className="h-5 w-px bg-slate-200 mr-1"></div>
          <div className="flex-1 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px]">
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
              className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#00394a] text-[11px] text-white hover:bg-[#00546e] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReplying ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

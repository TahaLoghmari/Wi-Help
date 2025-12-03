import { useState } from "react";
import { Button, Textarea, Checkbox } from "@/components/ui";
import { StarRatingInput } from "@/features/reviews";
import { useSubmitReview } from "@/features/reviews";
import type { SubmitReviewRequest } from "@/features/reviews";
import { GetProfessional } from "@/features/professional";

interface SubmitReviewFormProps {
  professionalId: string;
  onSuccess?: () => void;
}

const MAX_COMMENT_LENGTH = 2000;

export function SubmitReviewForm({
  professionalId,
  onSuccess,
}: SubmitReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { mutate: submitReview, isPending } = useSubmitReview();
  const { data: professional } = GetProfessional({ professionalId });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      return;
    }

    if (!comment.trim()) {
      return;
    }

    if (!acceptedTerms) {
      return;
    }

    const request: SubmitReviewRequest = {
      professionalId,
      comment: comment.trim(),
      rating,
    };

    submitReview(request, {
      onSuccess: () => {
        setRating(0);
        setComment("");
        setAcceptedTerms(false);
        onSuccess?.();
      },
    });
  };

  const professionalName = professional
    ? `Dr. ${professional.firstName} ${professional.lastName}`
    : "this professional";

  const remainingChars = MAX_COMMENT_LENGTH - comment.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-brand-dark text-xs font-semibold tracking-tight">
          Write a review for {professionalName}
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Share your experience and help others make informed decisions.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-medium text-slate-700">
          Rating
        </label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="comment"
          className="block text-[11px] font-medium text-slate-700"
        >
          Your review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => {
            if (e.target.value.length <= MAX_COMMENT_LENGTH) {
              setComment(e.target.value);
            }
          }}
          placeholder="Share your experience with this professional..."
          className="min-h-[100px] text-xs text-slate-700 placeholder:text-slate-400"
          rows={4}
        />
        <p className="text-[11px] text-slate-500">
          {remainingChars} characters remaining
        </p>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
        />
        <label
          htmlFor="terms"
          className="cursor-pointer text-[11px] leading-relaxed text-slate-700"
        >
          I have read and accept{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue font-medium hover:underline"
          >
            Terms & Conditions
          </a>
        </label>
      </div>

      <Button
        type="submit"
        disabled={
          isPending || rating === 0 || !comment.trim() || !acceptedTerms
        }
        className="bg-brand-dark hover:bg-brand-secondary w-full text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        size="sm"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}

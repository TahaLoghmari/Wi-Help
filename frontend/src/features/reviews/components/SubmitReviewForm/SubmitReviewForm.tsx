import { useState } from "react";
import { Button, Textarea, Checkbox } from "@/components/ui";
import { StarRatingInput } from "@/features/reviews";
import { useSubmitReview } from "@/features/reviews";
import type { SubmitReviewRequest } from "@/features/reviews";
import { GetProfessional } from "@/features/professional";
import { useTranslation } from "react-i18next";

interface SubmitReviewFormProps {
  professionalId: string;
  onSuccess?: () => void;
}

const MAX_COMMENT_LENGTH = 2000;

export function SubmitReviewForm({
  professionalId,
  onSuccess,
}: SubmitReviewFormProps) {
  const { t } = useTranslation();
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
    : t("reviews.form.fallbackProfessionalName");

  const remainingChars = MAX_COMMENT_LENGTH - comment.length;
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-brand-dark text-xs font-semibold tracking-tight">
          {t("reviews.form.title", { name: professionalName })}
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {t("reviews.form.description")}
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-medium text-slate-700">
          {t("reviews.form.rating")}
        </label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="comment"
          className="block text-[11px] font-medium text-slate-700"
        >
          {t("reviews.form.comment")}
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => {
            if (e.target.value.length <= MAX_COMMENT_LENGTH) {
              setComment(e.target.value);
            }
          }}
          placeholder={t("reviews.form.placeholder")}
          className="min-h-[100px] text-xs text-slate-700 placeholder:text-slate-400"
          rows={4}
        />
        <p className="text-[11px] text-slate-500">
          {t("reviews.form.remaining", { count: remainingChars })}
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
          {t("reviews.form.terms")}
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
        {isPending ? t("reviews.form.submitting") : t("reviews.form.submit")}
      </Button>
    </form>
  );
}

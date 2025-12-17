import { useState } from "react";
import { Button, Textarea, Checkbox } from "@/components/ui";
import { StarRatingInput } from "@/features/reviews";
import { useSubmitPatientReview } from "@/features/reviews";
import type { SubmitPatientReviewRequest } from "@/features/reviews";
import { GetPatient } from "@/features/patient";
import { useTranslation } from "react-i18next";

interface SubmitPatientReviewFormProps {
  patientId: string;
  onSuccess?: () => void;
}

const MAX_COMMENT_LENGTH = 2000;

export function SubmitPatientReviewForm({
  patientId,
  onSuccess,
}: SubmitPatientReviewFormProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { mutate: submitPatientReview, isPending } = useSubmitPatientReview();
  const { data: patient } = GetPatient({ patientId });

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

    const request: SubmitPatientReviewRequest = {
      patientId,
      comment: comment.trim(),
      rating,
    };

    submitPatientReview(request, {
      onSuccess: () => {
        setRating(0);
        setComment("");
        setAcceptedTerms(false);
        onSuccess?.();
      },
    });
  };

  const patientName = patient
    ? `${patient.firstName} ${patient.lastName}`
    : t("reviews.form.fallbackPatientName");

  const remainingChars = MAX_COMMENT_LENGTH - comment.length;
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-brand-dark text-xs font-semibold tracking-tight">
          {t("reviews.form.patientReviewTitle", { name: patientName })}
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {t("reviews.form.patientReviewDescription")}
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
          placeholder={t("reviews.form.patientReviewPlaceholder")}
          className="min-h-[100px] text-xs text-slate-700 placeholder:text-slate-400"
          rows={4}
        />
        <p className="text-[11px] text-slate-500">
          {remainingChars} {t("reviews.form.charactersRemaining")}
        </p>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="cursor-pointer text-[11px] leading-tight text-slate-600"
        >
          {t("reviews.form.termsAgreement")}
        </label>
      </div>

      <Button
        type="submit"
        disabled={
          isPending || rating === 0 || !comment.trim() || !acceptedTerms
        }
        className="w-full"
      >
        {isPending
          ? t("reviews.form.submitting")
          : t("reviews.form.submitReview")}
      </Button>
    </form>
  );
}

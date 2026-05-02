import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { StarRating } from "./star-rating";

interface AddPatientReviewFormProps {
  onSubmit: (comment: string, rating: number) => void;
  isLoading?: boolean;
  initialComment?: string;
  initialRating?: number;
  isEdit?: boolean;
}

export function AddPatientReviewForm({
  onSubmit,
  isLoading = false,
  initialComment = "",
  initialRating = 0,
  isEdit = false,
}: AddPatientReviewFormProps) {
  const { t } = useTranslation();
  const [comment, setComment] = useState(initialComment);
  const [rating, setRating] = useState(initialRating);

  const isValid = comment.trim().length > 0 && rating > 0;

  return (
    <View className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-4">
      <Text className="text-sm font-semibold text-brand-dark mb-3">
        {isEdit
          ? t("patientProfile.reviews.editReview")
          : t("patientProfile.reviews.addReview")}
      </Text>

      {/* Star rating selector */}
      <View className="flex-row items-center gap-3 mb-3">
        <Text className="text-xs text-brand-secondary/60">
          {t("patientProfile.reviews.rating")}
        </Text>
        <StarRating value={rating} onChange={setRating} size={22} />
      </View>

      {/* Comment input */}
      <TextInput
        value={comment}
        onChangeText={setComment}
        multiline
        textAlignVertical="top"
        className="border border-brand-secondary/15 rounded-xl px-3 py-2.5 text-sm text-brand-dark bg-brand-bg min-h-[88px]"
        placeholderTextColor="rgba(0,84,110,0.4)"
        placeholder={t("patientProfile.reviews.writeReview")}
        maxLength={2000}
        accessibilityLabel="Review comment input"
      />
      <Text className="text-[10px] text-brand-secondary/40 text-right mt-1 mb-3">
        {comment.length}/2000
      </Text>

      {/* Submit */}
      <Pressable
        className="bg-brand-dark rounded-full py-3 items-center justify-center active:opacity-80"
        style={{ opacity: isValid && !isLoading ? 1 : 0.5 }}
        onPress={() => isValid && onSubmit(comment.trim(), rating)}
        disabled={!isValid || isLoading}
        accessibilityRole="button"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className="text-white font-semibold text-sm">
            {isEdit
              ? t("patientProfile.reviews.updateReview")
              : t("patientProfile.reviews.submitReview")}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

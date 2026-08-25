import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import {
  type ReviewDto,
  useDeleteReply,
  useDeleteReview,
  useEditReply,
  useGetReviews,
  useGetReviewStats,
  useReplyToReview,
  useSubmitReview,
  useToggleReviewLike,
  useUpdateReview,
} from "@/entities/review";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  getReviewCapabilities,
  type ReviewSubject,
  type ReviewViewer,
} from "@/features/reviews/review-capabilities";
import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";

interface ReviewsSectionProps {
  subject: ReviewSubject;
  viewer: ReviewViewer;
}

function ReviewStatsHeader({
  averageRating,
  totalCount,
}: {
  averageRating: number;
  totalCount: number;
}) {
  const filledStars = Math.round(averageRating);

  return (
    <View className="flex-row items-center mb-4">
      <View
        className="flex-row items-center gap-1 rounded-full border border-brand-secondary/15 bg-white px-2.5 py-1"
        style={{ alignSelf: "flex-start" }}
      >
        <View className="flex-row items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Ionicons
              key={index}
              name="star"
              size={11}
              color={
                index < filledStars ? "#f5a623" : "rgba(0,84,110,0.15)"
              }
            />
          ))}
        </View>
        <Text className="ml-1 text-[12px] font-semibold text-brand-dark">
          {averageRating.toFixed(1)}
        </Text>
        <Text className="text-[11px] text-brand-secondary/50">
          ({totalCount})
        </Text>
      </View>
    </View>
  );
}

export function ReviewsSection({ subject, viewer }: ReviewsSectionProps) {
  const { t } = useTranslation();
  const translationRoot =
    subject.kind === "patient"
      ? "patientProfile.reviews"
      : "professionalProfile.reviews";
  const { data: statsData } = useGetReviewStats(subject.id);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useGetReviews(subject.id);
  const reviews = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );
  const viewerReview = useMemo(
    () =>
      viewer.profileId
        ? reviews.find((review) => review.author.id === viewer.profileId)
        : undefined,
    [reviews, viewer.profileId],
  );
  const capabilities = getReviewCapabilities({ subject, viewer });

  const submitMutation = useSubmitReview(subject.id);
  const updateMutation = useUpdateReview(subject.id);
  const deleteMutation = useDeleteReview(subject.id);
  const likeMutation = useToggleReviewLike(subject.id);
  const replyMutation = useReplyToReview(subject.id);
  const editReplyMutation = useEditReply(subject.id);
  const deleteReplyMutation = useDeleteReply(subject.id);

  const [reviewPendingDeleteId, setReviewPendingDeleteId] = useState<
    string | null
  >(null);
  const [replyPendingDeleteId, setReplyPendingDeleteId] = useState<
    string | null
  >(null);
  const [replyReviewPendingDeleteId, setReplyReviewPendingDeleteId] = useState<
    string | null
  >(null);

  const showUnexpectedError = useCallback(() => {
    Toast.show({ type: "error", text1: t("errors.unexpected") });
  }, [t]);

  const handleSubmitReview = useCallback(
    (comment: string, rating: number) => {
      if (!viewer.profileId) return;
      submitMutation.mutate({ comment, rating }, { onError: showUnexpectedError });
    },
    [showUnexpectedError, submitMutation, viewer.profileId],
  );

  const handleEditReview = useCallback(
    (reviewId: string, comment: string, rating: number) => {
      updateMutation.mutate(
        { reviewId, data: { comment, rating } },
        { onError: showUnexpectedError },
      );
    },
    [showUnexpectedError, updateMutation],
  );

  const handleConfirmDeleteReview = useCallback(() => {
    if (!reviewPendingDeleteId) return;
    deleteMutation.mutate(reviewPendingDeleteId, {
      onSuccess: () => setReviewPendingDeleteId(null),
      onError: () => {
        setReviewPendingDeleteId(null);
        showUnexpectedError();
      },
    });
  }, [deleteMutation, reviewPendingDeleteId, showUnexpectedError]);

  const handleLikeReview = useCallback(
    (reviewId: string, isLiked: boolean) => {
      likeMutation.mutate({ reviewId, isLiked });
    },
    [likeMutation],
  );

  const handleReplyToReview = useCallback(
    (reviewId: string, comment: string) => {
      replyMutation.mutate(
        { reviewId, data: { comment } },
        { onError: showUnexpectedError },
      );
    },
    [replyMutation, showUnexpectedError],
  );

  const handleEditReply = useCallback(
    (reviewId: string, replyId: string, comment: string) => {
      editReplyMutation.mutate(
        { reviewId, replyId, data: { comment } },
        { onError: showUnexpectedError },
      );
    },
    [editReplyMutation, showUnexpectedError],
  );

  const handleDeleteReply = useCallback((reviewId: string, replyId: string) => {
    setReplyReviewPendingDeleteId(reviewId);
    setReplyPendingDeleteId(replyId);
  }, []);

  const dismissDeleteReply = useCallback(() => {
    setReplyPendingDeleteId(null);
    setReplyReviewPendingDeleteId(null);
  }, []);

  const handleConfirmDeleteReply = useCallback(() => {
    if (!replyPendingDeleteId || !replyReviewPendingDeleteId) return;
    deleteReplyMutation.mutate(
      {
        reviewId: replyReviewPendingDeleteId,
        replyId: replyPendingDeleteId,
      },
      {
        onSuccess: dismissDeleteReply,
        onError: () => {
          dismissDeleteReply();
          showUnexpectedError();
        },
      },
    );
  }, [
    deleteReplyMutation,
    dismissDeleteReply,
    replyPendingDeleteId,
    replyReviewPendingDeleteId,
    showUnexpectedError,
  ]);

  const renderItem = useCallback(
    ({ item }: { item: ReviewDto }) => (
      <ReviewCard
        review={item}
        subject={subject}
        viewer={viewer}
        onLike={handleLikeReview}
        onReply={handleReplyToReview}
        onEdit={handleEditReview}
        onDelete={setReviewPendingDeleteId}
        onEditReply={handleEditReply}
        onDeleteReply={handleDeleteReply}
        isLikeLoading={
          likeMutation.isPending && likeMutation.variables?.reviewId === item.id
        }
        isReplyLoading={
          replyMutation.isPending &&
          replyMutation.variables?.reviewId === item.id
        }
        editingReplyId={
          editReplyMutation.isPending
            ? (editReplyMutation.variables?.replyId ?? null)
            : null
        }
        deletingReplyId={
          deleteReplyMutation.isPending
            ? (deleteReplyMutation.variables?.replyId ?? null)
            : null
        }
      />
    ),
    [
      deleteReplyMutation.isPending,
      deleteReplyMutation.variables?.replyId,
      editReplyMutation.isPending,
      editReplyMutation.variables?.replyId,
      handleDeleteReply,
      handleEditReply,
      handleEditReview,
      handleLikeReview,
      handleReplyToReview,
      likeMutation.isPending,
      likeMutation.variables?.reviewId,
      replyMutation.isPending,
      replyMutation.variables?.reviewId,
      subject,
      viewer,
    ],
  );

  const renderFooter = useCallback(
    () =>
      hasNextPage ? (
        <View className="items-center py-4">
          {isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#00546e" />
          ) : (
            <Pressable
              className="px-4 py-2 rounded-full border border-brand-secondary/20"
              onPress={() => fetchNextPage()}
              accessibilityRole="button"
            >
              <Text className="text-xs text-brand-secondary">
                {t(`${translationRoot}.loadMore`)}
              </Text>
            </Pressable>
          )}
        </View>
      ) : null,
    [fetchNextPage, hasNextPage, isFetchingNextPage, t, translationRoot],
  );

  const listHeader = useMemo(
    () => (
      <View>
        {statsData && statsData.totalCount > 0 && (
          <ReviewStatsHeader
            averageRating={statsData.averageRating}
            totalCount={statsData.totalCount}
          />
        )}

        {capabilities.canSubmitReview && !viewerReview && (
          <ReviewForm
            onSubmit={handleSubmitReview}
            isLoading={submitMutation.isPending}
          />
        )}

        {reviews.length === 0 && !isLoading && (
          <View className="items-center py-10 gap-2">
            <Ionicons
              name="chatbubble-outline"
              size={36}
              color="rgba(0,84,110,0.2)"
            />
            <Text className="text-base font-semibold text-brand-dark">
              {t(`${translationRoot}.noReviews`)}
            </Text>
            <Text className="text-sm text-brand-secondary/60 text-center">
              {t(`${translationRoot}.noReviewsDesc`)}
            </Text>
          </View>
        )}
      </View>
    ),
    [
      capabilities.canSubmitReview,
      handleSubmitReview,
      isLoading,
      reviews.length,
      statsData,
      submitMutation.isPending,
      t,
      translationRoot,
      viewerReview,
    ],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00546e" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#00546e"
          />
        }
        onEndReached={() =>
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }
        onEndReachedThreshold={0.3}
      />

      <ConfirmDialog
        visible={reviewPendingDeleteId !== null}
        title={t(`${translationRoot}.deleteReview`)}
        subtitle={t(`${translationRoot}.confirmDelete`)}
        confirmLabel={t(`${translationRoot}.deleteReview`)}
        dismissLabel={t("common.cancel")}
        onConfirm={handleConfirmDeleteReview}
        onDismiss={() => setReviewPendingDeleteId(null)}
        destructive
        isLoading={deleteMutation.isPending}
      />
      <ConfirmDialog
        visible={replyPendingDeleteId !== null}
        title={t(`${translationRoot}.deleteReview`)}
        subtitle={t(`${translationRoot}.confirmDelete`)}
        confirmLabel={t(`${translationRoot}.deleteReview`)}
        dismissLabel={t("common.cancel")}
        onConfirm={handleConfirmDeleteReply}
        onDismiss={dismissDeleteReply}
        destructive
        isLoading={deleteReplyMutation.isPending}
      />
    </>
  );
}

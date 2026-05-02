import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { type ReviewDto } from "@/features/reviews/types/api.types";
import { StarRating } from "./star-rating";
import { ReviewReplyItem } from "./review-reply-item";

// ─── Permission helpers ───────────────────────────────────────────────────────
//
// Rules:
//  • Author  (professional who wrote the review) → can like, edit, delete
//  • Subject (patient being reviewed)            → can like, reply
//  • Both author and subject can reply
//  • Reply owner can edit/delete their own reply; Admins can edit/delete any

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function formatReviewDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PatientReviewCardProps {
  review: ReviewDto;
  /** The professional profile ID of the current user (if viewer is Professional) */
  currentProfessionalId?: string;
  /** The user account ID of the currently logged-in user (for reply ownership) */
  currentUserId?: string;
  /** Whether viewer is the patient on this profile (they are the review subject) */
  isPatient?: boolean;
  isAdmin?: boolean;
  onLike: (reviewId: string, isLiked: boolean) => void;
  onReply: (reviewId: string, comment: string) => void;
  onEdit: (reviewId: string, comment: string, rating: number) => void;
  onDelete: (reviewId: string) => void;
  onEditReply: (reviewId: string, replyId: string, comment: string) => void;
  onDeleteReply: (reviewId: string, replyId: string) => void;
  isLikeLoading?: boolean;
  isReplyLoading?: boolean;
  editingReplyId?: string | null;
  deletingReplyId?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PatientReviewCard = React.memo(function PatientReviewCard({
  review,
  currentProfessionalId,
  currentUserId,
  isPatient = false,
  isAdmin = false,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onEditReply,
  onDeleteReply,
  isLikeLoading = false,
  isReplyLoading = false,
  editingReplyId = null,
  deletingReplyId = null,
}: PatientReviewCardProps) {
  const { t } = useTranslation();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const replyInputRef = useRef<TextInput>(null);

  // Author = professional who wrote the review
  const isAuthor =
    currentProfessionalId != null && review.author.id === currentProfessionalId;

  // Subject = the patient (isPatient viewer is always the subject on this profile)
  const isSubject = isPatient;

  // Can like: author or subject
  const canLike = isAuthor || isSubject || isAdmin;
  // Can reply: author or subject
  const canReply = isAuthor || isSubject || isAdmin;
  // Can edit/delete the review: only the author
  const isOwnReview = isAuthor;

  const author = review.author;
  const proName =
    author.firstName && author.lastName
      ? `${author.firstName} ${author.lastName}`
      : "Professional";
  const proInitials =
    author.firstName && author.lastName
      ? `${author.firstName[0]}${author.lastName[0]}`.toUpperCase()
      : "P";

  const handleToggleReplyInput = useCallback(() => {
    setShowReplyInput((v) => {
      if (!v) {
        setTimeout(() => replyInputRef.current?.focus(), 100);
      }
      return !v;
    });
  }, []);

  const handleSendReply = useCallback(() => {
    if (!replyText.trim()) return;
    onReply(review.id, replyText.trim());
    setReplyText("");
    setShowReplyInput(false);
  }, [onReply, review.id, replyText]);

  const handleSaveEdit = useCallback(() => {
    if (!editComment.trim()) return;
    onEdit(review.id, editComment.trim(), editRating);
    setIsEditMode(false);
  }, [onEdit, review.id, editComment, editRating]);

  const cardShadow = {
    shadowColor: "#00222e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  };

  return (
    <View
      style={cardShadow}
      className="bg-white rounded-2xl border border-brand-secondary/10 p-4 mb-3"
    >
      {/* ─── Header: Professional pic + name + rating + date ─── */}
      <View className="flex-row items-start gap-3 mb-3">
        {author.profilePictureUrl ? (
          <Image
            source={{ uri: author.profilePictureUrl }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            contentFit="cover"
            accessibilityLabel={proName}
          />
        ) : (
          <View
            className="w-10 h-10 rounded-full bg-brand-teal/15 items-center justify-center"
            accessibilityLabel={proName}
          >
            <Text className="text-brand-dark font-semibold text-sm">
              {proInitials}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-sm font-semibold text-brand-dark flex-1 mr-2"
              numberOfLines={1}
            >
              {proName}
            </Text>

            {/* Own review actions */}
            {isOwnReview && !isEditMode && (
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => setIsEditMode(true)}
                  hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
                  accessibilityRole="button"
                  accessibilityLabel={t("patientProfile.reviews.editReview")}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={15}
                    color="rgba(0,84,110,0.5)"
                  />
                </Pressable>
                <Pressable
                  onPress={() => onDelete(review.id)}
                  hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
                  accessibilityRole="button"
                  accessibilityLabel={t("patientProfile.reviews.deleteReview")}
                >
                  <Ionicons
                    name="trash-outline"
                    size={15}
                    color="rgba(0,84,110,0.5)"
                  />
                </Pressable>
              </View>
            )}
          </View>

          <View className="flex-row items-center gap-2 mt-0.5">
            <StarRating
              value={isEditMode ? editRating : review.rating}
              readonly={!isEditMode}
              onChange={setEditRating}
              size={13}
            />
            <Text className="text-[10px] text-brand-secondary/50">
              {formatReviewDate(review.createdAt)} · {timeAgo(review.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* ─── Review text / Edit form ─── */}
      {isEditMode ? (
        <View className="mb-3 gap-2">
          <TextInput
            value={editComment}
            onChangeText={setEditComment}
            multiline
            textAlignVertical="top"
            className="border border-brand-secondary/20 rounded-xl px-3 py-2.5 text-sm text-brand-dark bg-brand-bg min-h-[80px]"
            placeholderTextColor="rgba(0,84,110,0.4)"
            placeholder={t("patientProfile.reviews.writeReview")}
            accessibilityLabel="Edit review text"
          />
          <View className="flex-row items-center gap-2 justify-end">
            <Pressable
              className="px-3 py-1.5 rounded-full border border-brand-secondary/20"
              onPress={() => {
                setIsEditMode(false);
                setEditComment(review.comment);
                setEditRating(review.rating);
              }}
              accessibilityRole="button"
            >
              <Text className="text-xs font-medium text-brand-secondary">
                {t("common.cancel")}
              </Text>
            </Pressable>
            <Pressable
              className="px-3 py-1.5 rounded-full bg-brand-dark"
              onPress={handleSaveEdit}
              disabled={!editComment.trim()}
              accessibilityRole="button"
            >
              <Text className="text-xs font-medium text-white">
                {t("patientProfile.reviews.updateReview")}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text className="text-sm text-brand-secondary/80 leading-relaxed mb-3">
          {review.comment}
        </Text>
      )}

      {/* ─── Footer: Like + Reply ─── */}
      <View className="flex-row items-center gap-4 border-t border-brand-secondary/10 pt-3">
        {/* Like button */}
        {canLike && (
          <Pressable
            className="flex-row items-center gap-1.5"
            onPress={() => onLike(review.id, review.isLiked)}
            disabled={isLikeLoading}
            accessibilityRole="button"
            accessibilityLabel={
              review.isLiked
                ? t("patientProfile.reviews.unlike")
                : t("patientProfile.reviews.like")
            }
          >
            {isLikeLoading ? (
              <ActivityIndicator size="small" color="#00546e" />
            ) : (
              <Ionicons
                name={review.isLiked ? "heart" : "heart-outline"}
                size={16}
                color={review.isLiked ? "#14d3ac" : "rgba(0,84,110,0.5)"}
              />
            )}
            <Text
              className={`text-xs font-medium ${review.isLiked ? "text-brand-teal" : "text-brand-secondary/60"}`}
            >
              {review.likesCount > 0 ? review.likesCount : ""}
              {review.likesCount > 0 ? " " : ""}
              {t("patientProfile.reviews.like")}
            </Text>
          </Pressable>
        )}

        {/* Reply button */}
        {canReply && (
          <Pressable
            className="flex-row items-center gap-1.5"
            onPress={handleToggleReplyInput}
            accessibilityRole="button"
          >
            <Ionicons
              name="chatbubble-outline"
              size={15}
              color="rgba(0,84,110,0.5)"
            />
            <Text className="text-xs font-medium text-brand-secondary/60">
              {t("patientProfile.reviews.reply")}
            </Text>
          </Pressable>
        )}

        {/* Collapse/expand replies */}
        {review.replies.length > 0 && (
          <Pressable
            className="flex-row items-center gap-1 ml-auto"
            onPress={() => setShowReplies((v) => !v)}
            accessibilityRole="button"
          >
            <Text className="text-[11px] text-brand-secondary/50">
              {showReplies
                ? t("patientProfile.reviews.hideReplies")
                : `${review.replies.length} ${t("patientProfile.reviews.replies")}`}
            </Text>
            <Ionicons
              name={showReplies ? "chevron-up" : "chevron-down"}
              size={12}
              color="rgba(0,84,110,0.4)"
            />
          </Pressable>
        )}
      </View>

      {/* ─── Reply input ─── */}
      {showReplyInput && (
        <View className="mt-3 flex-row items-end gap-2">
          <TextInput
            ref={replyInputRef}
            value={replyText}
            onChangeText={setReplyText}
            multiline
            textAlignVertical="top"
            className="flex-1 border border-brand-secondary/20 rounded-xl px-3 py-2.5 text-sm text-brand-dark bg-brand-bg min-h-[44px] max-h-[100px]"
            placeholderTextColor="rgba(0,84,110,0.4)"
            placeholder={t("patientProfile.reviews.writeReply")}
            accessibilityLabel="Reply text input"
          />
          <Pressable
            className="w-9 h-9 rounded-full bg-brand-dark items-center justify-center"
            onPress={handleSendReply}
            disabled={!replyText.trim() || isReplyLoading}
            accessibilityRole="button"
            accessibilityLabel={t("patientProfile.reviews.sendReply")}
          >
            {isReplyLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={15} color="white" />
            )}
          </Pressable>
        </View>
      )}

      {/* ─── Replies list ─── */}
      {showReplies && review.replies.length > 0 && (
        <View className="mt-3 gap-2">
          {review.replies.map((reply) => (
            <ReviewReplyItem
              key={reply.id}
              reply={reply}
              timeAgo={timeAgo}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onEditReply={(replyId, comment) =>
                onEditReply(review.id, replyId, comment)
              }
              onDeleteReply={(replyId) => onDeleteReply(review.id, replyId)}
              isEditLoading={editingReplyId === reply.id}
              isDeleteLoading={deletingReplyId === reply.id}
            />
          ))}
        </View>
      )}
    </View>
  );
});

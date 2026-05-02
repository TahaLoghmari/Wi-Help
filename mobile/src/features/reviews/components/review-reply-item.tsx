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
import { type ReviewReplyDto } from "@/features/reviews/types/api.types";

interface ReviewReplyItemProps {
  reply: ReviewReplyDto;
  timeAgo: (dateString: string) => string;
  /** Currently logged-in user's ID */
  currentUserId?: string;
  isAdmin?: boolean;
  onEditReply?: (replyId: string, comment: string) => void;
  onDeleteReply?: (replyId: string) => void;
  isEditLoading?: boolean;
  isDeleteLoading?: boolean;
}

export const ReviewReplyItem = React.memo(function ReviewReplyItem({
  reply,
  timeAgo,
  currentUserId,
  isAdmin = false,
  onEditReply,
  onDeleteReply,
  isEditLoading = false,
  isDeleteLoading = false,
}: ReviewReplyItemProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.comment);
  const inputRef = useRef<TextInput>(null);

  const name =
    reply.firstName && reply.lastName
      ? `${reply.firstName} ${reply.lastName}`
      : "User";

  const initials =
    reply.firstName && reply.lastName
      ? `${reply.firstName[0]}${reply.lastName[0]}`.toUpperCase()
      : "?";

  const canManage =
    (currentUserId != null && reply.userId === currentUserId) || isAdmin;

  const handleStartEdit = useCallback(() => {
    setEditText(reply.comment);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [reply.comment]);

  const handleSaveEdit = useCallback(() => {
    if (!editText.trim() || !onEditReply) return;
    onEditReply(reply.id, editText.trim());
    setIsEditing(false);
  }, [editText, onEditReply, reply.id]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditText(reply.comment);
  }, [reply.comment]);

  return (
    <View className="flex-row gap-2.5 pl-4 border-l-2 border-brand-secondary/10">
      {reply.profilePictureUrl ? (
        <Image
          source={{ uri: reply.profilePictureUrl }}
          style={{ width: 28, height: 28, borderRadius: 14 }}
          contentFit="cover"
          accessibilityLabel={name}
        />
      ) : (
        <View
          className="w-7 h-7 rounded-full bg-brand-teal/15 items-center justify-center"
          accessibilityLabel={name}
        >
          <Text className="text-brand-dark font-semibold text-[10px]">
            {initials}
          </Text>
        </View>
      )}

      <View className="flex-1">
        <View className="bg-brand-secondary/5 rounded-xl rounded-tl-none px-3 py-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className="text-xs font-semibold text-brand-dark flex-1 mr-2"
              numberOfLines={1}
            >
              {name}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-[10px] text-brand-secondary/50">
                {timeAgo(reply.createdAt)}
              </Text>
              {canManage && !isEditing && (
                <>
                  <Pressable
                    onPress={handleStartEdit}
                    hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
                    accessibilityRole="button"
                    accessibilityLabel={t("patientProfile.reviews.editReview")}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={12}
                      color="rgba(0,84,110,0.45)"
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => onDeleteReply?.(reply.id)}
                    disabled={isDeleteLoading}
                    hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
                    accessibilityRole="button"
                    accessibilityLabel={t(
                      "patientProfile.reviews.deleteReview",
                    )}
                  >
                    {isDeleteLoading ? (
                      <ActivityIndicator
                        size="small"
                        color="rgba(0,84,110,0.45)"
                      />
                    ) : (
                      <Ionicons
                        name="trash-outline"
                        size={12}
                        color="rgba(0,84,110,0.45)"
                      />
                    )}
                  </Pressable>
                </>
              )}
            </View>
          </View>

          {isEditing ? (
            <View className="gap-2">
              <TextInput
                ref={inputRef}
                value={editText}
                onChangeText={setEditText}
                multiline
                textAlignVertical="top"
                className="text-xs text-brand-dark bg-white border border-brand-secondary/20 rounded-lg px-2.5 py-2 min-h-[44px]"
                placeholderTextColor="rgba(0,84,110,0.4)"
                placeholder={t("patientProfile.reviews.writeReply")}
              />
              <View className="flex-row items-center gap-2 justify-end">
                <Pressable
                  className="px-2.5 py-1 rounded-full border border-brand-secondary/20"
                  onPress={handleCancelEdit}
                  accessibilityRole="button"
                >
                  <Text className="text-[11px] font-medium text-brand-secondary">
                    {t("common.cancel")}
                  </Text>
                </Pressable>
                <Pressable
                  className="px-2.5 py-1 rounded-full bg-brand-dark"
                  onPress={handleSaveEdit}
                  disabled={!editText.trim() || isEditLoading}
                  accessibilityRole="button"
                >
                  {isEditLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-[11px] font-medium text-white">
                      {t("patientProfile.reviews.updateReview")}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            <Text className="text-xs text-brand-secondary/80 leading-relaxed">
              {reply.comment}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
});

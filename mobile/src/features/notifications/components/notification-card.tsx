import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import type { NotificationDto } from "@/features/notifications/types/notifications.types";
import {
  getIconConfig,
  getRelativeTime,
  CARD_SHADOW,
} from "@/features/notifications/lib/utils";

interface NotificationCardProps {
  notification: NotificationDto;
  onPress: (id: string) => void;
}

export const NotificationCard = React.memo(function NotificationCard({
  notification,
  onPress,
}: NotificationCardProps) {
  const icon = getIconConfig(notification.type);

  return (
    <Pressable
      onPress={() => {
        if (!notification.isRead) onPress(notification.id);
      }}
      style={CARD_SHADOW}
      className={clsx(
        "mx-4 mb-3 bg-white rounded-2xl p-4",
        notification.isRead
          ? "border-l-0"
          : "border-l-[3px] border-l-brand-teal",
      )}
      accessibilityLabel={notification.title}
      accessibilityRole="button"
    >
      <View className="flex-row items-start gap-3">
        {/* Icon badge */}
        <View
          className={clsx(
            "w-[42px] h-[42px] rounded-full items-center justify-center shrink-0",
            icon.bgClass,
          )}
        >
          <Ionicons name={icon.name} size={20} color={icon.color} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text
            className="text-sm font-semibold text-brand-dark"
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text
            className="text-xs text-brand-secondary/70 mt-0.5"
            numberOfLines={2}
          >
            {notification.message}
          </Text>
          <Text className="text-[10px] text-brand-secondary/50 mt-1.5">
            {getRelativeTime(notification.createdAt)}
          </Text>
        </View>

        {/* Unread dot */}
        {!notification.isRead && (
          <View className="w-2 h-2 rounded-full bg-brand-teal mt-1 shrink-0" />
        )}
      </View>
    </Pressable>
  );
});

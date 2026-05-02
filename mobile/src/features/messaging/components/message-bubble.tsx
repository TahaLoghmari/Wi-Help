import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { type MessageDto } from "@/features/messaging/types/messaging.types";
import { formatBubbleTime, getInitials } from "@/features/messaging/lib/utils";

interface MessageBubbleProps {
  message: MessageDto;
  isOwn: boolean;
  showAvatar: boolean;
  contactFirstName: string;
  contactLastName: string;
  contactProfilePictureUrl: string | null;
  isLastInGroup: boolean;
}

function DeliveryIcon({ status }: { status: string }) {
  if (status === "Read") {
    return <Ionicons name="checkmark-done" size={12} color="#14d3ac" />;
  }
  if (status === "Delivered") {
    return (
      <Ionicons name="checkmark-done" size={12} color="rgba(0,84,110,0.4)" />
    );
  }
  return <Ionicons name="checkmark" size={12} color="rgba(0,84,110,0.4)" />;
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
  isOwn,
  showAvatar,
  contactFirstName,
  contactLastName,
  isLastInGroup,
}: MessageBubbleProps) {
  const initials = getInitials(contactFirstName, contactLastName);

  if (isOwn) {
    return (
      <View
        className={`flex-row justify-end px-4 ${isLastInGroup ? "mb-4" : "mb-2"}`}
      >
        <View className="max-w-[75%]">
          <View className="bg-brand-dark rounded-2xl rounded-tr-sm px-4 py-2.5">
            <Text className="text-sm text-white">{message.content}</Text>
          </View>
          <View className="flex-row items-center justify-end mt-1 gap-1">
            <Text className="text-[10px] text-brand-secondary/40">
              {formatBubbleTime(message.createdAt)}
            </Text>
            <DeliveryIcon status={message.status} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      className={`flex-row items-start px-4 ${isLastInGroup ? "mb-4" : "mb-2"}`}
    >
      {showAvatar ? (
        <View className="w-8 h-8 rounded-full bg-brand-teal/20 items-center justify-center mr-2">
          <Text className="text-brand-dark font-semibold text-[10px]">
            {initials}
          </Text>
        </View>
      ) : (
        <View className="w-8 mr-2" />
      )}

      <View className="max-w-[75%]">
        <View className="bg-white border border-brand-secondary/10 rounded-2xl rounded-tl-sm px-4 py-2.5">
          <Text className="text-sm text-brand-dark">{message.content}</Text>
        </View>
        <Text className="text-[10px] text-brand-secondary/40 mt-1">
          {formatBubbleTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
});

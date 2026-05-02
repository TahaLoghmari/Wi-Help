import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { type ConversationDto } from "@/features/messaging/types/messaging.types";
import {
  getInitials,
  formatMessageTime,
  getMessagePreview,
  CARD_SHADOW,
} from "@/features/messaging/lib/utils";
import { TypingDots } from "./typing-dots";

interface ChatCardProps {
  conversation: ConversationDto;
  currentUserId: string;
  isOnline: boolean;
  isTyping: boolean;
  onPress: (conversation: ConversationDto) => void;
}

export const ChatCard = React.memo(function ChatCard({
  conversation,
  currentUserId,
  isOnline,
  isTyping,
  onPress,
}: ChatCardProps) {
  const initials = getInitials(
    conversation.otherParticipantFirstName,
    conversation.otherParticipantLastName,
  );
  const preview = getMessagePreview(conversation.lastMessage, currentUserId);

  return (
    <Pressable
      style={CARD_SHADOW.card}
      className="mx-4 mb-3 bg-white rounded-2xl p-4 active:opacity-80"
      onPress={() => onPress(conversation)}
      accessibilityLabel={`Chat with ${conversation.otherParticipantFirstName} ${conversation.otherParticipantLastName}`}
      accessibilityRole="button"
    >
      <View className="flex-row items-center">
        <View className="relative mr-3">
          {conversation.otherParticipantProfilePictureUrl ? (
            <Image
              source={{ uri: conversation.otherParticipantProfilePictureUrl }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
              contentFit="cover"
            />
          ) : (
            <View className="w-12 h-12 rounded-full bg-brand-teal/20 items-center justify-center">
              <Text className="text-brand-dark font-semibold text-sm">
                {initials}
              </Text>
            </View>
          )}
          <View
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? "bg-brand-teal" : "bg-brand-secondary/30"
            }`}
          />
        </View>

        <View className="flex-1 mr-2">
          <Text
            className="text-base font-bold text-brand-dark"
            numberOfLines={1}
          >
            {conversation.otherParticipantFirstName}{" "}
            {conversation.otherParticipantLastName}
          </Text>

          {isTyping ? (
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <Text className="text-sm text-brand-teal italic">typing</Text>
              <TypingDots dotSize={4} color="#14d3ac" />
            </View>
          ) : preview ? (
            <Text
              className="text-sm text-brand-secondary/60 mt-0.5"
              numberOfLines={1}
            >
              {preview.isOwn ? (
                <Text className="text-brand-secondary/40">You: </Text>
              ) : null}
              {preview.text}
            </Text>
          ) : (
            <Text className="text-sm text-brand-secondary/40 mt-0.5 italic">
              No messages yet
            </Text>
          )}
        </View>

        <View className="items-end gap-1.5">
          {conversation.lastMessage && (
            <Text className="text-xs text-brand-secondary/50">
              {formatMessageTime(conversation.lastMessage.createdAt)}
            </Text>
          )}
          {conversation.unreadCount > 0 && (
            <View className="bg-brand-teal rounded-full px-1.5 py-0.5 min-w-[20px] items-center">
              <Text className="text-[10px] font-bold text-white">
                {conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

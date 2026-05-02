import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getInitials } from "@/features/messaging/lib/utils";
import { HeaderTypingDots } from "./typing-dots";

interface ConversationHeaderProps {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  isOnline: boolean;
  isTyping: boolean;
  backRoute?: string;
}

export function ConversationHeader({
  firstName,
  lastName,
  profilePictureUrl,
  isOnline,
  isTyping,
  backRoute,
}: ConversationHeaderProps) {
  const initials = getInitials(firstName, lastName);

  return (
    <SafeAreaView edges={["top"]} className="bg-brand-bg">
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => {
            if (backRoute) {
              router.navigate(
                backRoute as Parameters<typeof router.navigate>[0],
              );
            } else {
              router.navigate("/(professional)/messages");
            }
          }}
          className="w-9 h-9 rounded-full bg-brand-secondary/10 items-center justify-center mr-3 active:opacity-80"
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color="#00394a" />
        </Pressable>

        <View className="relative mr-3">
          {profilePictureUrl ? (
            <Image
              source={{ uri: profilePictureUrl }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              contentFit="cover"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-brand-teal/20 items-center justify-center">
              <Text className="text-brand-dark font-semibold text-xs">
                {initials}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1">
          <Text
            className="text-base font-semibold text-brand-dark"
            numberOfLines={1}
          >
            {firstName} {lastName}
          </Text>
          {isTyping ? (
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs text-brand-teal italic">typing</Text>
              <HeaderTypingDots />
            </View>
          ) : (
            <Text
              className={`text-xs ${
                isOnline ? "text-brand-teal" : "text-brand-secondary/40"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

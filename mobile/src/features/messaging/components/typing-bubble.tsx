import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { TypingDots } from "./typing-dots";
import { getInitials } from "../lib/utils";

interface TypingBubbleProps {
  firstName: string;
  lastName: string;
}

export function TypingBubble({ firstName, lastName }: TypingBubbleProps) {
  const initials = getInitials(firstName, lastName);

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      className="flex-row items-end px-4 mb-4"
    >
      <View className="w-8 h-8 rounded-full bg-brand-teal/20 items-center justify-center mr-2">
        <Text className="text-brand-dark font-semibold text-[10px]">
          {initials}
        </Text>
      </View>
      <View className="bg-white border border-brand-secondary/10 rounded-2xl rounded-tl-sm px-4 py-3">
        <TypingDots dotSize={8} color="rgba(0,84,110,0.4)" />
      </View>
    </Animated.View>
  );
}

import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

function SkeletonPulse({ className }: { className: string }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={`bg-brand-secondary/10 ${className}`}
    />
  );
}

function SkeletonCard() {
  return (
    <View className="mx-4 mb-3 bg-white rounded-2xl p-4">
      <View className="flex-row items-center">
        <SkeletonPulse className="w-12 h-12 rounded-full mr-3" />
        <View className="flex-1 gap-2">
          <SkeletonPulse className="h-4 w-32 rounded" />
          <SkeletonPulse className="h-3 w-48 rounded" />
        </View>
        <View className="items-end gap-2">
          <SkeletonPulse className="h-3 w-10 rounded" />
          <SkeletonPulse className="h-4 w-5 rounded-full" />
        </View>
      </View>
    </View>
  );
}

export function ChatListSkeleton() {
  return (
    <View className="pt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

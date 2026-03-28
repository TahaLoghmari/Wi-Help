import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { CARD_SHADOW, DISPLAY_ORDER } from "@/features/professionals/lib/utils";

function SkeletonDayCard() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      false,
    );
    // Shared values are stable refs — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[CARD_SHADOW, animatedStyle]}
      className="bg-white rounded-2xl"
    >
      <View className="flex-row items-center px-4 py-4 gap-3">
        <View className="h-4 w-24 rounded-full bg-brand-secondary/10 flex-1" />
        <View className="h-6 w-14 rounded-full bg-brand-secondary/10" />
        <View className="w-12 h-7 rounded-full bg-brand-secondary/10" />
        <View className="w-4 h-4 rounded bg-brand-secondary/10" />
      </View>
    </Animated.View>
  );
}

export function ScheduleSkeleton() {
  return (
    <View className="px-4 gap-3">
      {DISPLAY_ORDER.map((d) => (
        <SkeletonDayCard key={d} />
      ))}
    </View>
  );
}

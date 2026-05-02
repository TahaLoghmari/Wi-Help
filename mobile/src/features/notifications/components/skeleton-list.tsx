import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  SKELETON_WIDTHS,
  CARD_SHADOW,
} from "@/features/notifications/lib/utils";

export function SkeletonList() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 750 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={animatedStyle} className="pt-2">
      {SKELETON_WIDTHS.map((widths, i) => (
        <View
          key={i}
          style={CARD_SHADOW}
          className="mx-4 mb-3 bg-white rounded-2xl p-4"
        >
          <View className="flex-row items-start gap-3">
            <View className="w-[42px] h-[42px] rounded-full bg-brand-secondary/10 shrink-0" />
            <View className="flex-1 gap-2">
              <View
                className="h-3.5 rounded-full bg-brand-secondary/10"
                style={{ width: widths.title }}
              />
              <View
                className="h-2.5 rounded-full bg-brand-secondary/10"
                style={{ width: widths.msg1 }}
              />
              <View
                className="h-2.5 rounded-full bg-brand-secondary/10"
                style={{ width: widths.msg2 }}
              />
              <View
                className="h-2 rounded-full bg-brand-secondary/10 mt-1"
                style={{ width: "25%" }}
              />
            </View>
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

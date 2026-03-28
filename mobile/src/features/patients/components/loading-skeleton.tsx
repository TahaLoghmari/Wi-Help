import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

function SkeletonCard() {
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
      style={[styles.card, animatedStyle]}
      className="mx-4 mb-3.5 bg-white rounded-2xl p-4"
    >
      <View className="flex-row items-center gap-3 mb-4">
        <View className="w-12 h-12 rounded-full bg-brand-secondary/10" />
        <View className="flex-1 gap-2">
          <View className="h-4 w-32 rounded-full bg-brand-secondary/10" />
          <View className="h-3 w-20 rounded-full bg-brand-secondary/10" />
        </View>
      </View>
      <View className="h-3 w-40 rounded-full bg-brand-secondary/10 mb-2" />
      <View className="h-3 w-56 rounded-full bg-brand-secondary/10 mb-4" />
      <View className="flex-row gap-2">
        <View className="flex-1 h-9 rounded-full bg-brand-secondary/10" />
        <View className="flex-1 h-9 rounded-full bg-brand-secondary/10" />
        <View className="w-9 h-9 rounded-full bg-brand-secondary/10" />
      </View>
    </Animated.View>
  );
}

export function LoadingSkeleton() {
  return (
    <View>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#00222e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
});

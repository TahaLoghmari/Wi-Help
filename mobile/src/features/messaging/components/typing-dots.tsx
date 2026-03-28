import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface TypingDotsProps {
  dotSize?: number;
  color?: string;
}

function useDotBounce(delay: number) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(-4, {
            duration: 300,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: 300,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
      ),
      -1,
      false,
    );
  }, [translateY, delay]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
}

export function TypingDots({
  dotSize = 6,
  color = "rgba(0,84,110,0.4)",
}: TypingDotsProps) {
  const style1 = useDotBounce(0);
  const style2 = useDotBounce(150);
  const style3 = useDotBounce(300);

  return (
    <View className="flex-row items-center gap-1">
      <Animated.View
        style={[
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
          },
          style1,
        ]}
      />
      <Animated.View
        style={[
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
          },
          style2,
        ]}
      />
      <Animated.View
        style={[
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
          },
          style3,
        ]}
      />
    </View>
  );
}

/** Larger typing dots for the header "typing…" indicator */
export function HeaderTypingDots() {
  return <TypingDots dotSize={4} color="#14d3ac" />;
}

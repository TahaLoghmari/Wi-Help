import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function useBounce(durationMs: number, delayMs = 0) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    const start = () => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(0, { duration: delayMs, easing: Easing.linear }),
          withTiming(-10, {
            duration: durationMs / 2,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: durationMs / 2,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      );
    };
    start();
  }, [translateY, durationMs, delayMs]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
}

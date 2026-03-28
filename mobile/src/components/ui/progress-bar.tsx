import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  className?: string;
  trackClassName?: string;
}

export function ProgressBar({
  value,
  className,
  trackClassName,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return (
    <View
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className,
      )}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
    >
      <View
        className={cn("h-full rounded-full bg-brand-teal", trackClassName)}
        style={{ width: `${clampedValue}%` }}
      />
    </View>
  );
}

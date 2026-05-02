import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({
  value,
  onChange,
  size = 16,
  readonly = false,
}: StarRatingProps) {
  return (
    <View className="flex-row items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        return readonly ? (
          <Ionicons
            key={star}
            name={filled ? "star" : "star-outline"}
            size={size}
            color={filled ? "#ffecb4" : "rgba(0,84,110,0.2)"}
          />
        ) : (
          <Pressable
            key={star}
            onPress={() => onChange?.(star)}
            hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
            accessibilityLabel={`Rate ${star} stars`}
            accessibilityRole="button"
          >
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={size}
              color={filled ? "#ffb300" : "rgba(0,84,110,0.3)"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TodayStatCardProps {
  label: string;
  count: number;
  bgColor: string;
  iconBgColor: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
}

export function TodayStatCard({
  label,
  count,
  bgColor,
  iconBgColor,
  iconName,
  iconColor,
}: TodayStatCardProps) {
  return (
    <View
      className="flex-1 rounded-2xl p-4"
      style={{ backgroundColor: bgColor }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-[10px] font-semibold uppercase tracking-widest text-brand-secondary/60">
          {label}
        </Text>
        <View
          className="w-7 h-7 rounded-full items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <Ionicons name={iconName} size={14} color={iconColor} />
        </View>
      </View>
      <Text className="text-3xl font-semibold text-brand-dark tracking-tight">
        {count}
      </Text>
    </View>
  );
}

import React from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { cn } from "@/lib/utils";

interface FilterTabsProps<T extends string> {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (tab: T) => void;
}

export function FilterTabs<T extends string>({
  tabs,
  active,
  onChange,
}: FilterTabsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
    >
      {tabs.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            className={cn(
              "px-5 py-2 rounded-full",
              isActive
                ? "bg-brand-dark shadow-sm"
                : "bg-transparent border border-brand-secondary/15 shadow-transparent",
            )}
            accessibilityLabel={`Filter ${label}`}
            accessibilityRole="tab"
          >
            <Text
              className={cn(
                "text-sm font-medium whitespace-nowrap",
                isActive ? "text-white" : "text-brand-secondary",
              )}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

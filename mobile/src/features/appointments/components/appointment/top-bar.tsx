import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
      }}
    >
      <Pressable
        className="w-10 h-10 rounded-full bg-brand-secondary/10 items-center justify-center active:opacity-80"
        onPress={() => router.back()}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Ionicons name="chevron-back" size={20} color="#00394a" />
      </Pressable>

      <Text className="text-xl font-semibold tracking-tight text-brand-dark">
        {title}
      </Text>

      {/* Spacer — keeps the title visually centered */}
      <View style={{ width: 40, height: 40 }} />
    </View>
  );
}

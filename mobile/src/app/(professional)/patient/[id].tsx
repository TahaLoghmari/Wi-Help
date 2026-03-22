import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function PatientProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          className="w-9 h-9 rounded-full border border-brand-secondary/15 items-center justify-center"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color="#00394a" />
        </Pressable>
        <Text className="text-lg font-semibold text-brand-dark tracking-tight">
          Patient Profile
        </Text>
      </View>

      {/* Placeholder content */}
      <View className="flex-1 items-center justify-center px-6 gap-3">
        <Ionicons
          name="person-circle-outline"
          size={64}
          color="rgba(0,84,110,0.2)"
        />
        <Text className="text-base font-semibold text-brand-dark">
          Profile coming soon
        </Text>
        <Text className="text-sm text-brand-secondary/60 text-center">
          Detailed patient profile for ID: {id ?? "—"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

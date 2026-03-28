import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function NotFoundRoute() {
  return (
    <SafeAreaView className="flex-1 bg-brand-bg items-center justify-center px-6">
      <View className="items-center gap-3">
        <Text className="text-6xl font-bold text-brand-dark/10">404</Text>
        <Text className="text-base font-semibold text-brand-dark">
          Page not found
        </Text>
        <Pressable
          onPress={() => router.replace("/")}
          accessibilityRole="button"
          accessibilityLabel="Go home"
        >
          <Text className="text-sm text-brand-teal font-medium">Go home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

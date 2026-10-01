import React from "react";
import { Text, View } from "react-native";
import { Button } from "@/shared/ui/button";

export function GuardErrorState({ onRetry }: { onRetry: () => unknown }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-brand-bg px-6">
      <Text className="text-center text-lg font-semibold text-brand-dark">
        Unable to verify your session
      </Text>
      <Text className="text-center text-sm text-brand-secondary/60">
        Check your connection and try again.
      </Text>
      <Button
        onPress={() => {
          void onRetry();
        }}
      >
        Try Again
      </Button>
    </View>
  );
}

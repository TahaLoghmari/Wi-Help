import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfessionalAppHeader } from "@/components/ProfessionalAppHeader";

export default function MessagesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <ProfessionalAppHeader />
      <View className="flex-1 items-center justify-center">
        <Text className="text-brand-secondary/50 text-base font-medium">
          Messages — coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}

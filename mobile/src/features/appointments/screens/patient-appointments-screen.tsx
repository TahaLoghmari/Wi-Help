import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientAppointmentsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-brand-secondary/50 text-base font-medium">
          Patient appointments — coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}

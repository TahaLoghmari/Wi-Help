import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "@/components/app-header";
import { useCurrentUser } from "@/api/auth/use-current-user";
import { useNotifications } from "@/api/notifications/get-notifications";

export function MessagesScreen() {
  const { data: user } = useCurrentUser();
  const { data: notificationsData } = useNotifications();
  const hasUnread =
    notificationsData?.pages.flatMap((p) => p.items).some((n) => !n.isRead) ??
    false;
  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <AppHeader user={user} hasUnread={hasUnread} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-brand-secondary/50 text-base font-medium">
          Messages — coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}

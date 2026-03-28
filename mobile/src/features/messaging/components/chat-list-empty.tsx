import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface ChatListEmptyProps {
  hasQuery: boolean;
}

export function ChatListEmpty({ hasQuery }: ChatListEmptyProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-8 pt-16">
      <Ionicons
        name={hasQuery ? "search-outline" : "chatbubbles-outline"}
        size={48}
        color="rgba(0,84,110,0.25)"
      />
      <Text className="text-brand-secondary/50 text-base font-medium mt-4 text-center">
        {hasQuery
          ? t("professional.messages.emptySearchTitle")
          : t("professional.messages.emptyTitle")}
      </Text>
      <Text className="text-brand-secondary/40 text-sm mt-1 text-center">
        {hasQuery
          ? t("professional.messages.emptySearchSubtitle")
          : t("professional.messages.emptySubtitle")}
      </Text>
    </View>
  );
}

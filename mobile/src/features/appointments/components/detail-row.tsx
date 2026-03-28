import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DetailRowProps {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}

export function DetailRow({ iconName, label, value }: DetailRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: "rgba(0,57,74,0.06)",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        <Ionicons name={iconName} size={15} color="#00546e" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: "rgba(0,84,110,0.5)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#00394a",
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

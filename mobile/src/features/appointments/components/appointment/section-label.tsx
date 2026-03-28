import React from "react";
import { Text } from "react-native";

interface SectionLabelProps {
  label: string;
}

export function SectionLabel({ label }: SectionLabelProps) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: "700",
        color: "rgba(0,84,110,0.5)",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 8,
        marginLeft: 2,
      }}
    >
      {label}
    </Text>
  );
}

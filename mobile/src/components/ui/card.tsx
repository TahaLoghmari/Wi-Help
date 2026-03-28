import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface CardProps extends ViewProps {
  className?: string;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-4 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}

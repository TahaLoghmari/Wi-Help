import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  className,
  containerClassName,
  accessibilityLabel,
  ...props
}: InputProps) {
  return (
    <View className={cn("w-full", containerClassName)}>
      {label ? (
        <Text className="mb-1.5 text-base font-medium text-brand-dark">
          {label}
        </Text>
      ) : null}
      <TextInput
        className={cn(
          "w-full rounded-xl border border-gray-200 bg-brand-bg px-4 py-3.5 text-base text-brand-dark",
          error && "border-red-500",
          className,
        )}
        placeholderTextColor="#9ca3af"
        accessibilityLabel={accessibilityLabel ?? label}
        {...props}
      />
      {error ? (
        <Text className="mt-1 text-sm text-red-500">{error}</Text>
      ) : null}
    </View>
  );
}

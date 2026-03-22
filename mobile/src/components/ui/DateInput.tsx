import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@/components/ui/Input";

export interface DateInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function DateInput({ label, value, onChange, error }: DateInputProps) {
  const handleChangeText = (text: string) => {
    const digits = text.replace(/\D/g, "");
    let formatted = digits.slice(0, 2);
    if (digits.length > 2) formatted += "/" + digits.slice(2, 4);
    if (digits.length > 4) formatted += "/" + digits.slice(4, 8);
    onChange(formatted);
  };

  return (
    <View className="gap-y-1.5">
      <Text className="text-base font-medium text-brand-dark">{label}</Text>
      <View className="relative">
        <Input
          value={value}
          onChangeText={handleChangeText}
          error={error}
          placeholder="DD/MM/YYYY"
          keyboardType="numeric"
          maxLength={10}
          accessibilityLabel={label}
          className="pl-11"
        />
        <View className="absolute left-3.5 top-3.5" pointerEvents="none">
          <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
        </View>
      </View>
    </View>
  );
}

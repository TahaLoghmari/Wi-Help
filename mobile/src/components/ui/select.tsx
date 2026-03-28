import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  accessibilityLabel?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  label,
  error,
  placeholder,
  searchPlaceholder = "Search...",
  options,
  value,
  onValueChange,
  accessibilityLabel,
  className,
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const slideAnim = useRef(new Animated.Value(600)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOpen(false);
      setSearch("");
    });
  }, [slideAnim, backdropOpacity]);

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [options, value],
  );

  const filtered = useMemo(
    () =>
      search
        ? options.filter((o) =>
            o.label.toLowerCase().includes(search.toLowerCase()),
          )
        : options,
    [options, search],
  );

  return (
    <View className="w-full">
      {label ? (
        <Text className="mb-1.5 text-base font-medium text-brand-dark">
          {label}
        </Text>
      ) : null}
      <Pressable
        className={cn(
          "w-full flex-row items-center justify-between rounded-xl border border-gray-200 bg-brand-bg px-4 py-3.5",
          error && "border-red-500",
          disabled && "opacity-50",
          className,
        )}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
      >
        <Text
          className={cn(
            "flex-1 text-base",
            selectedLabel ? "text-brand-dark" : "text-gray-400",
          )}
          numberOfLines={1}
        >
          {selectedLabel || placeholder || "Select..."}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#9ca3af" />
      </Pressable>
      {error ? (
        <Text className="mt-1 text-sm text-red-500">{error}</Text>
      ) : null}

      <Modal
        visible={open}
        animationType="none"
        transparent
        onRequestClose={handleClose}
        onShow={() => {
          slideAnim.setValue(600);
          backdropOpacity.setValue(0);
          Animated.parallel([
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 220,
              useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
              toValue: 0,
              damping: 28,
              stiffness: 220,
              useNativeDriver: true,
            }),
          ]).start();
        }}
      >
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(0,0,0,0.4)", opacity: backdropOpacity },
            ]}
          />
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
            accessibilityLabel="Close"
            accessibilityRole="button"
          />
        </View>
        <View className="flex-1 justify-end" pointerEvents="box-none">
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <View
              className="rounded-t-2xl bg-white px-4 pb-8 pt-4"
              style={{ maxHeight: 560 }}
            >
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-brand-dark">
                  {label ?? "Select"}
                </Text>
                <Pressable
                  onPress={handleClose}
                  hitSlop={8}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={24} color="#374151" />
                </Pressable>
              </View>
              <TextInput
                className="mb-3 rounded-xl border border-gray-200 bg-brand-bg px-4 py-3 text-base text-brand-dark"
                placeholder={searchPlaceholder}
                placeholderTextColor="#9ca3af"
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    className={cn(
                      "flex-row items-center justify-between border-b border-gray-100 px-2 py-3.5",
                      item.value === value && "bg-brand-bg",
                    )}
                    onPress={() => {
                      onValueChange(item.value);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <Text
                      className={cn(
                        "text-base",
                        item.value === value
                          ? "font-semibold text-brand-primary"
                          : "text-brand-dark",
                      )}
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Ionicons name="checkmark" size={20} color="#0ea5e9" />
                    )}
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text className="py-8 text-center text-base text-gray-400">
                    No results found.
                  </Text>
                }
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

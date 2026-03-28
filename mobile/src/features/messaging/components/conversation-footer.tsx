import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, TextInput, Pressable, Platform, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface ConversationFooterProps {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  isSending: boolean;
}

const LINE_HEIGHT = 20;
const MAX_LINES = 5;
const MAX_INPUT_HEIGHT = LINE_HEIGHT * MAX_LINES + 24;

export function ConversationFooter({
  onSend,
  onTypingStart,
  onTypingStop,
  isSending,
}: ConversationFooterProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const inputRef = useRef<TextInput>(null);

  const handleChangeText = useCallback(
    (value: string) => {
      setText(value);

      if (value.trim().length > 0) {
        if (!isTypingRef.current) {
          isTypingRef.current = true;
          onTypingStart();
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          isTypingRef.current = false;
          onTypingStop();
        }, 2000);
      } else {
        if (isTypingRef.current) {
          isTypingRef.current = false;
          onTypingStop();
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
        }
      }
    },
    [onTypingStart, onTypingStop],
  );

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    onSend(trimmed);
    setText("");

    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTypingStop();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  }, [text, isSending, onSend, onTypingStop]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (isTypingRef.current) onTypingStop();
    };
  }, [onTypingStop]);

  const hasContent = text.trim().length > 0;

  return (
    <View
      className="bg-brand-bg"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-row items-end px-4 pt-2 gap-2">
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={handleChangeText}
          placeholder="Write a message…"
          placeholderTextColor="rgba(0,84,110,0.45)"
          multiline
          maxLength={5000}
          className="flex-1 rounded-2xl border border-brand-secondary/15 bg-white px-4 py-3 text-base text-brand-dark"
          style={{ maxHeight: MAX_INPUT_HEIGHT, lineHeight: LINE_HEIGHT }}
          textAlignVertical="top"
          returnKeyType={Platform.OS === "ios" ? "default" : "send"}
          blurOnSubmit={false}
          accessibilityLabel="Message input"
        />
        <Pressable
          onPress={handleSend}
          disabled={!hasContent || isSending}
          className={`rounded-full bg-brand-dark w-11 h-11 items-center justify-center ${
            hasContent ? "active:opacity-80" : "opacity-40"
          }`}
          accessibilityLabel="Send message"
          accessibilityRole="button"
        >
          <Ionicons name="send" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
